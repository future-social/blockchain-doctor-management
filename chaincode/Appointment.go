package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"time"
)

type DoctorAvailability struct {
	DoctorID       string              `json:"doctorID"`
	Availability   map[string][]string `json:"availability"`
	TimeSlotLength int                 `json:"timeSlotLength"`
}

type Appointment struct {
	AppointmentID   string `json:"appointmentID"`
	PatientID       string `json:"patientID"`
	DoctorID        string `json:"doctorID"`
	AppointmentDate string `json:"appointmentDate"`
	AppointmentTime string `json:"AppointmentTime"`
}

type Patient struct {
	PatientID    string `json:"patientID"`
	Name         string `json:"name"`
	Age          int    `json:"age"`
	Gender       string `json:"gender"`
	ICNo         string `json:"ic_no"`
	MobileNumber string `json:"mobile_number"`
}

type AppointmentContract struct {
	contractapi.Contract
}

// SetDoctorAvailability set doctor availability time
func (ac *AppointmentContract) SetDoctorAvailability(ctx contractapi.TransactionContextInterface, doctorID string) error {

	layout := "2006-01-02"

	availability := make(map[string][]string)
	//Set the length of the appointment
	timeSlotLength := 20

	//get current date
	now := time.Now()
	// get Monday current of current week
	monday := now.AddDate(0, 0, -int(now.Weekday())+1)

	//Calculate next two weeks availability
	for day := 0; day < 14; day++ {
		//calculate date
		date := monday.AddDate(0, 0, day)
		//Skip Saturdays and Sundays
		if date.Weekday() == time.Saturday || date.Weekday() == time.Sunday {
			continue
		}
		//Generate time slot and store
		availability[date.Format(layout)] = generateTimeSlots()
	}

	doctorAvailability := &DoctorAvailability{
		DoctorID:       doctorID,
		Availability:   availability,
		TimeSlotLength: timeSlotLength,
	}

	doctorAvailabilityJSON, err := json.Marshal(doctorAvailability)
	if err != nil {
		return fmt.Errorf("failed to marshal doctor availability: %v", err)
	}
	err = ctx.GetStub().PutState(doctorID, doctorAvailabilityJSON)
	if err != nil {
		return fmt.Errorf("failed to put doctor availability to ledger: %v", err)
	}

	return nil
}

// generateTimeSlots generate time slot
func generateTimeSlots() []string {
	timeSlots := make([]string, 0)
	slotDuration := 20 * time.Minute // The length of the time slot is 20 minutes

	startTimeMorning := time.Date(0, 1, 1, 9, 0, 0, 0, time.UTC)
	endTimeMorning := time.Date(0, 1, 1, 12, 0, 0, 0, time.UTC)

	for startTimeMorning.Before(endTimeMorning) {
		timeSlots = append(timeSlots, startTimeMorning.Format("15:04"))
		startTimeMorning = startTimeMorning.Add(slotDuration)
	}

	startTimeAfternoon := time.Date(0, 1, 1, 14, 0, 0, 0, time.UTC)
	endTimeAfternoon := time.Date(0, 1, 1, 18, 0, 0, 0, time.UTC)
	for startTimeAfternoon.Before(endTimeAfternoon) {
		timeSlots = append(timeSlots, startTimeAfternoon.Format("15:04"))
		startTimeAfternoon = startTimeAfternoon.Add(slotDuration)
	}

	return timeSlots
}

// GetDoctorAvailability retrieve doctor's available
func (ac *AppointmentContract) GetDoctorAvailability(ctx contractapi.TransactionContextInterface, doctorID string) (map[string][]string, error) {

	doctorAvailabilityJSON, err := ctx.GetStub().GetState(doctorID)

	if err != nil {
		return nil, fmt.Errorf("failed to read doctor availability from ledger: %v", err)
	}
	if doctorAvailabilityJSON == nil {
		return nil, fmt.Errorf("doctor availability not found for doctor ID %s", doctorID)
	}

	var doctorAvailability DoctorAvailability
	err = json.Unmarshal(doctorAvailabilityJSON, &doctorAvailability)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal doctor availability: %v", err)
	}

	return doctorAvailability.Availability, nil
	// Example: "2024-02-19": {"09:00", "09:20", "09:40", "10:00", "10:20", "10:40", "14:00", "14:20", "14:40", "15:00", "15:20", "15:40"}
}

// BookAppointment books an appointment for a patient with a doctor
func (ac *AppointmentContract) BookAppointment(ctx contractapi.TransactionContextInterface, doctorID string,
	patientID string, appointmentDate string, appointmentTime string) error {

	//Getting Doctor Availability
	availability, err := ac.GetDoctorAvailability(ctx, doctorID)
	if err != nil {
		return fmt.Errorf("failed to get doctor availability: %v", err)
	}

	//Check the doctor's availability for that appointment date
	timeSlots, ok := availability[appointmentDate]
	if !ok {
		return fmt.Errorf("doctor is not available on %s", appointmentDate)
	}

	//Check availability of appointment time
	var available bool
	for _, slot := range timeSlots {
		if slot == appointmentTime {
			available = true
			break
		}
	}
	if !available {
		return fmt.Errorf("doctor is not available at %s on %s", appointmentTime, appointmentDate)
	}

	// Remove appointment slot from availability time slot
	for i, slot := range timeSlots {
		if slot == appointmentTime {
			availability[appointmentDate] = append(timeSlots[:i], timeSlots[i+1:]...)
			break
		}
	}

	//update doctor availability to ledger
	err = ac.UpdateDoctorAvailability(ctx, doctorID, availability)
	if err != nil {
		return fmt.Errorf("failed to update doctor availability: %v", err)
	}

	//retrieve total appointments
	totalAppointments, err := ac.GetTotalAppointments(ctx, doctorID)
	if err != nil {
		return fmt.Errorf("failed to get total appointments: %v", err)
	}

	//Create appointment object
	appointmentID := generateAppointmentID(doctorID, appointmentDate, totalAppointments)

	appointment := &Appointment{
		AppointmentID:   appointmentID,
		PatientID:       patientID,
		DoctorID:        doctorID,
		AppointmentDate: appointmentDate,
		AppointmentTime: appointmentTime,
	}

	// store appointment information into ledger
	appointmentJSON, err := json.Marshal(appointment)
	if err != nil {
		return fmt.Errorf("failed to marshal appointment: %v", err)
	}
	err = ctx.GetStub().PutState(appointmentID, appointmentJSON)
	if err != nil {
		return fmt.Errorf("failed to put appointment to ledger: %v", err)
	}

	return nil
}

func generateAppointmentID(doctorID string, appointmentDate string, totalAppointments int) string {
	return fmt.Sprintf("%s-%s-%d", doctorID, appointmentDate, totalAppointments+1)
}

func (ac *AppointmentContract) GetTotalAppointments(ctx contractapi.TransactionContextInterface, doctorID string) (int, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return 0, fmt.Errorf("failed to read from world state: %v", err)
	}
	defer resultsIterator.Close()

	totalAppointments := 0

	for resultsIterator.HasNext() {
		_, err := resultsIterator.Next()
		if err != nil {
			return 0, fmt.Errorf("failed to iterate appointment: %v", err)
		}
		totalAppointments++
	}

	return totalAppointments, nil
}

// UpdateDoctorAvailability updates the availability of a doctor in the ledger
func (ac *AppointmentContract) UpdateDoctorAvailability(ctx contractapi.TransactionContextInterface, doctorID string, availability map[string][]string) error {
	// Marshal the updated availability to JSON
	availabilityJSON, err := json.Marshal(availability)
	if err != nil {
		return fmt.Errorf("failed to marshal updated availability: %v", err)
	}

	// Write the updated availability to the ledger
	err = ctx.GetStub().PutState(doctorID, availabilityJSON)
	if err != nil {
		return fmt.Errorf("failed to update doctor availability on ledger: %v", err)
	}

	return nil
}
