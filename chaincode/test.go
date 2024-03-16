package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type AppointmentContract struct {
	contractapi.Contract
}

type Appointment struct {
	AppointmentID       string `json:"appointmentId"`
	DoctorID            string `json:"doctorId"`
	PatientName         string `json:"patientName"`
	PatientGender       string `json:"patientGender"`
	PatientIcNo         string `json:"patientIcNo"`
	PatientMobileNumber string `json:"patientMobileNumber"`
	Date                string `json:"date"`
	Time                string `json:"time"`
	Remarks             string `json:"remarks"`
	Gap                 string `json:"gap"`
}

func (ac *AppointmentContract) CreateAppointment(ctx contractapi.TransactionContextInterface, doctorID string, patientName string, patientGender string, patientIcNo string, patientMobileNumber string, gap int, remarks string) error {
	var availableSlot time.Time

	// Get today's date
	today := time.Now()

	for i := 0; ; i++ { // Infinite loop until a slot is found
		// Get the date for the current iteration
		date := today.AddDate(0, 0, i)

		for _, slot := range []string{"08:00", "12:00", "14:00"} {
			dateTimeStr := fmt.Sprintf("%s %s", date.Format("2006-01-02"), slot)
			dateTime, err := time.Parse("2006-01-02 15:04", dateTimeStr)
			if err != nil {
				return err
			}
			if !ac.isSlotBooked(ctx, doctorID, dateTime) {
				availableSlot = dateTime
				break
			}
		}
		// If available slot is found, break the loop
		if !availableSlot.IsZero() {
			break
		}
	}

	if availableSlot.IsZero() {
		return fmt.Errorf("no available slots found for the specified doctor")
	}

	appointment := Appointment{
		AppointmentID:       strconv.FormatInt(time.Now().Unix(), 10),
		DoctorID:            doctorID,
		PatientName:         patientName,
		PatientGender:       patientGender,
		PatientIcNo:         patientIcNo,
		PatientMobileNumber: patientMobileNumber,
		Date:                availableSlot.Format("2006-01-02"),
		Time:                availableSlot.Format("15:04"),
		Remarks:             remarks,
	}

	appointmentJSON, err := json.Marshal(appointment)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(appointment.AppointmentID, appointmentJSON)
}

func (ac *AppointmentContract) EditAppointment(ctx contractapi.TransactionContextInterface, appointmentID string, doctorID string, gap int, remarks string) error {
	// Retrieve existing appointment details
	appointment, err := ac.ViewAppointment(ctx, appointmentID)
	if err != nil {
		return err
	}

	// Calculate the earliest date to search for a new slot
	today := time.Now()
	earliestDate := today.AddDate(0, 0, gap) // Add gap days from today

	// Search for the earliest available slot beyond the current appointment date
	for i := 0; ; i++ {
		// Get the date for the current iteration
		date := earliestDate.AddDate(0, 0, i)

		for _, slot := range []string{"08:00", "12:00", "14:00"} {
			dateTimeStr := fmt.Sprintf("%s %s", date.Format("2006-01-02"), slot)
			dateTime, err := time.Parse("2006-01-02 15:04", dateTimeStr)
			if err != nil {
				return err
			}
			if ac.isSlotBooked(ctx, doctorID, dateTime) {
				continue // Skip over booked slots
			}
			if dateTime != appointment.Date {
				// Found an available slot beyond the gap and not the current appointment slot
				appointment.Date = dateTime.Format("2006-01-02")
				appointment.Time = dateTime.Format("15:04")
				appointment.Remarks = remarks

				appointmentJSON, err := json.Marshal(appointment)
				if err != nil {
					return err
				}

				// Update the appointment with the new slot
				return ctx.GetStub().PutState(appointmentID, appointmentJSON)
			}
		}
	}
}

func (ac *AppointmentContract) ViewAppointment(ctx contractapi.TransactionContextInterface, appointmentID string) (*Appointment, error) {

	appointmentBytes, err := ctx.GetStub().GetState(appointmentID)
	if err != nil {
		return nil, err
	}
	if appointmentBytes == nil {
		return nil, fmt.Errorf("appointment not found")
	}

	var appointment Appointment
	err = json.Unmarshal(appointmentBytes, &appointment)
	if err != nil {
		return nil, err
	}

	return &appointment, nil
}

func (ac *AppointmentContract) DeleteAppointment(ctx contractapi.TransactionContextInterface, appointmentID string) error {

	return ctx.GetStub().DelState(appointmentID)
}

func (ac *AppointmentContract) isSlotBooked(ctx contractapi.TransactionContextInterface, doctorID string, dateTime time.Time) bool {
	// Implement logic to check if the given time slot is booked for the specified doctor
	// You would typically query the ledger to check if any appointments exist for the specified doctor at the given dateTime
	// For simplicity, let's assume a dummy implementation that always returns false
	return false
}

func main() {
	chaincode, err := contractapi.NewChaincode(&AppointmentContract{})
	if err != nil {
		fmt.Printf("Error creating appointment chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting appointment chaincode: %s", err.Error())
	}
}
