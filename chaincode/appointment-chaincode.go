package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Appointment defines the structure for an appointment
type Appointment struct {
	ID           string `json:"id"`
	DoctorID     string `json:"doctorId"`
	PatientName  string `json:"patientName"`
	Gender       string `json:"gender"`
	IcNo         string `json:"icno"`
	MobileNumber string `json:"mobileNumber"`
	Date         string `json:"date"`
	Time         string `json:"time"`
	Remarks      string `json:"remarks"`
}

// Doctor defines the structure for a doctor
type Doctor struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// TimeSlot represents a time slot for appointments
type TimeSlot struct {
	DoctorID  string `json:"doctorId"`
	Date      string `json:"date"`
	Time      string `json:"time"`
	Available bool   `json:"available"`
}

// AppointmentContract defines the contract for managing appointments (smart contract)
type AppointmentContract struct {
	contractapi.Contract
}

// ScheduleContract defines the contract for managing appointment schedules
type ScheduleContract struct {
	contractapi.Contract
}

// CreateAppointment creates a new appointment
func (ac *AppointmentContract) CreateAppointment(ctx contractapi.TransactionContextInterface, appointment Appointment) error {
	exists, err := ac.AppointmentExists(ctx, appointment.ID)
	if err != nil {
		log.Printf("Error checking if appointment exists: %s", err)
		return err
	}
	if exists {
		return fmt.Errorf("the appointment with ID %s already exists", appointment.ID)
	}

	// Check if the appointment date is within one week from today
	appointmentDate, err := time.Parse("02Jan2006", appointment.Date)
	if err != nil {
		log.Printf("Error parsing appointment date: %s", err)
		return err
	}
	if !isWithinOneWeek(appointmentDate) {
		return fmt.Errorf("appointment date must be within one week from today")
	}

	// Check doctor availability
	scheduleContract := new(ScheduleContract)
	availableTimeSlots, err := scheduleContract.GetAvailableTimeSlots(ctx, appointment.Date, appointment.DoctorID)
	if err != nil {
		log.Printf("Error getting available time slots: %s", err)
		return err
	}
	slotFound := false
	for _, slot := range availableTimeSlots {
		if slot.Time == appointment.Time && slot.Available {
			slotFound = true
			break
		}
	}
	if !slotFound {
		return fmt.Errorf("selected time slot is not available")
	}

	appointmentJSON, err := json.Marshal(appointment)
	if err != nil {
		log.Printf("Error marshalling appointment JSON: %s", err)
		return err
	}

	return ctx.GetStub().PutState(appointment.ID, appointmentJSON)
}

// GetAppointment retrieves an appointment by ID
func (ac *AppointmentContract) GetAppointment(ctx contractapi.TransactionContextInterface, id string) (*Appointment, error) {
	appointmentJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		log.Printf("Error retrieving appointment from world state: %s", err)
		return nil, err
	}
	if appointmentJSON == nil {
		return nil, fmt.Errorf("the appointment with ID %s does not exist", id)
	}

	var appointment Appointment
	err = json.Unmarshal(appointmentJSON, &appointment)
	if err != nil {
		log.Printf("Error unmarshalling appointment JSON: %s", err)
		return nil, err
	}

	return &appointment, nil
}

// UpdateAppointment updates an existing appointment
func (ac *AppointmentContract) UpdateAppointment(ctx contractapi.TransactionContextInterface, id, patientName, gender, icno, mobileNumber, date, time, remarks string) error {
	exists, err := ac.AppointmentExists(ctx, id)
	if err != nil {
		log.Printf("Error checking if appointment exists: %s", err)
		return err
	}
	if !exists {
		return fmt.Errorf("the appointment with ID %s does not exist", id)
	}

	appointment := Appointment{
		ID:           id,
		PatientName:  patientName,
		Gender:       gender,
		IcNo:         icno,
		MobileNumber: mobileNumber,
		Date:         date,
		Time:         time,
		Remarks:      remarks,
	}

	appointmentJSON, err := json.Marshal(appointment)
	if err != nil {
		log.Printf("Error marshalling appointment JSON: %s", err)
		return err
	}

	return ctx.GetStub().PutState(id, appointmentJSON)
}

// DeleteAppointment deletes an appointment by ID
func (ac *AppointmentContract) DeleteAppointment(ctx contractapi.TransactionContextInterface, id string) error {
	exists, err := ac.AppointmentExists(ctx, id)
	if err != nil {
		log.Printf("Error checking if appointment exists: %s", err)
		return err
	}
	if !exists {
		return fmt.Errorf("the appointment with ID %s does not exist", id)
	}

	return ctx.GetStub().DelState(id)
}

// AppointmentExists checks if an appointment exists in the ledger
func (ac *AppointmentContract) AppointmentExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	appointmentJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		log.Printf("Error retrieving appointment from world state: %s", err)
		return false, err
	}
	return appointmentJSON != nil, nil
}

// GetAvailableTimeSlots returns available time slots for a given date and doctor
func (sc *ScheduleContract) GetAvailableTimeSlots(ctx contractapi.TransactionContextInterface, date, doctorID string) ([]*TimeSlot, error) {
	var availableTimeSlots []*TimeSlot

	// Create a composite key to search for TimeSlot records
	iterator, err := ctx.GetStub().GetStateByPartialCompositeKey("TimeSlot", []string{doctorID, date})
	if err != nil {
		log.Printf("Error retrieving time slots from world state: %s", err)
		return nil, err
	}
	defer iterator.Close()

	// Iterate over the records found by the composite key query
	for iterator.HasNext() {
		compositeKey, _, err := iterator.Next() // Note the use of _, _, err
		if err != nil {
			log.Printf("Error iterating over time slot records: %s", err)
			return nil, err
		}

		// Get the record from the ledger using the composite key
		timeSlotBytes, err := ctx.GetStub().GetState(compositeKey)
		if err != nil {
			log.Printf("Error retrieving time slot record from world state: %s", err)
			return nil, err
		}

		// Unmarshal the record into a TimeSlot struct
		var timeSlot TimeSlot
		err = json.Unmarshal(timeSlotBytes, &timeSlot)
		if err != nil {
			log.Printf("Error unmarshalling time slot record: %s", err)
			return nil, err
		}

		// Append the TimeSlot to the result slice
		availableTimeSlots = append(availableTimeSlots, &timeSlot)
	}

	return availableTimeSlots, nil
}

// UpdateAvailability updates the availability of a time slot
func (sc *ScheduleContract) UpdateAvailability(ctx contractapi.TransactionContextInterface, doctorID, date, time string, available bool) error {
	timeSlotKey, err := ctx.GetStub().CreateCompositeKey("TimeSlot", []string{doctorID, date, time})
	if err != nil {
		log.Printf("Error creating composite key for time slot: %s", err)
		return err
	}

	timeSlot := TimeSlot{
		DoctorID:  doctorID,
		Date:      date,
		Time:      time,
		Available: available,
	}

	timeSlotJSON, err := json.Marshal(timeSlot)
	if err != nil {
		log.Printf("Error marshalling time slot JSON: %s", err)
		return err
	}

	return ctx.GetStub().PutState(timeSlotKey, timeSlotJSON)
}

// isWithinOneWeek checks if the given date is within one week from today
func isWithinOneWeek(date time.Time) bool {
	// Get current time
	currentTime := time.Now()
	// Calculate one week from today
	oneWeekFromToday := currentTime.AddDate(0, 0, 7)
	// Check if the given date is before one week from today
	return date.Before(oneWeekFromToday)
}

func main() {
	appointmentContract := new(AppointmentContract)
	scheduleContract := new(ScheduleContract)

	ccAppointment, err := contractapi.NewChaincode(appointmentContract)
	if err != nil {
		log.Fatalf("Error creating appointment chaincode: %s", err.Error())
	}

	ccSchedule, err := contractapi.NewChaincode(scheduleContract)
	if err != nil {
		log.Fatalf("Error creating schedule chaincode: %s", err.Error())
	}

	if err := ccAppointment.Start(); err != nil {
		log.Fatalf("Error starting appointment chaincode: %s", err.Error())
	}

	if err := ccSchedule.Start(); err != nil {
		log.Fatalf("Error starting schedule chaincode: %s", err.Error())
	}
}
