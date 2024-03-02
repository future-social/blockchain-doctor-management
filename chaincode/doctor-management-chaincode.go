package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// DoctorContract to define the smart contract
type DoctorContract struct {
	contractapi.Contract
}

// Doctor struct to store doctor information
type Doctor struct {
	DoctorID       string    `json:"doctor_id"`
	FirstName      string    `json:"first_name"`
	LastName       string    `json:"last_name"`
	ICNo           string    `json:"ic_no"`
	Gender         string    `json:"gender"`
	BirthDate      time.Time `json:"birth_date"`
	MobileNumber   string    `json:"mobile_number"`
	Email          string    `json:"email"`
	Address        string    `json:"address"`
	Specialisation string    `json:"specialisation"`
}

// InitDoctor adds a base set of doctors to the ledger
func (dc *DoctorContract) InitDoctor(ctx contractapi.TransactionContextInterface) error {
	doctors := []Doctor{
		{
			DoctorID:       "doc1",
			FirstName:      "John",
			LastName:       "Doe",
			ICNo:           "123456-12-1234",
			Gender:         "Male",
			BirthDate:      time.Date(1980, 1, 1, 0, 0, 0, 0, time.UTC),
			MobileNumber:   "1234567890",
			Email:          "john@example.com",
			Address:        "123 Main St, Anytown, USA",
			Specialisation: "General Medicine",
		},
		{
			DoctorID:       "doc2",
			FirstName:      "Jane",
			LastName:       "Smith",
			ICNo:           "987654-23-4567",
			Gender:         "Female",
			BirthDate:      time.Date(1975, 5, 10, 0, 0, 0, 0, time.UTC),
			MobileNumber:   "9876543210",
			Email:          "jane@example.com",
			Address:        "456 Elm St, Othertown, USA",
			Specialisation: "Pediatrics",
		},
	}

	for _, doctor := range doctors {
		doctorJSON, err := json.Marshal(doctor)
		if err != nil {
			return fmt.Errorf("failed to marshal doctor JSON: %v", err)
		}
		err = ctx.GetStub().PutState(doctor.DoctorID, doctorJSON)
		if err != nil {
			return fmt.Errorf("failed to create doctor: %v", err)
		}
	}

	return nil
}



// CreateDoctor creates a new doctor with the provided information and stores it in the world state
func (dc *DoctorContract) CreateDoctor(ctx contractapi.TransactionContextInterface, doctorID string, firstName string, lastName string,
	icNo string, gender string, birthDate time.Time, mobileNumber string, email string, address string, specialisation string) error {
	//Check if the doctor already exists
	exists, err := dc.DoctorExists(ctx, doctorID)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the doctor with ID %s already exists", doctorID)
	}

	newDoctor := Doctor{
		DoctorID:       doctorID,
		FirstName:      firstName,
		LastName:       lastName,
		ICNo:           icNo,
		Gender:         gender,
		BirthDate:      birthDate,
		MobileNumber:   mobileNumber,
		Email:          email,
		Address:        address,
		Specialisation: specialisation,
	}

	// Convert doctor information to JSON format
	doctorJSON, err := json.Marshal(newDoctor)
	if err != nil {

		return fmt.Errorf("failed to marshal doctor JSON: %v", err)
	}
	// Storing doctor information into the blockchain
	err = ctx.GetStub().PutState(doctorID, doctorJSON)
	if err != nil {
		return fmt.Errorf("failed to create doctor: %v", err)
	}

	return nil
}

// ViewDoctor to view doctor's information
func (dc *DoctorContract) ViewDoctor(ctx contractapi.TransactionContextInterface, doctorID string) (*Doctor, error) {
	doctorJSON, err := ctx.GetStub().GetState(doctorID)
	if err != nil {

		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}

	if doctorJSON == nil {
		return nil, fmt.Errorf("doctor does not exist")
	}

	var doctor Doctor
	err = json.Unmarshal(doctorJSON, &doctor)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal doctor JSON: %v", err)
	}

	return &doctor, nil
}

// UpdateDoctor updates an existing doctor's information in the world state with provided parameters.
func (dc *DoctorContract) UpdateDoctor(ctx contractapi.TransactionContextInterface, doctorID string, firstName string, lastName string,
	icNo string, gender string, birthDate time.Time, mobileNumber string, email string, address string, specialisation string) error {
	exists, err := dc.DoctorExists(ctx, doctorID)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the doctor with ID %s does not exist", doctorID)
	}

	updateDoctor := Doctor{
		DoctorID:       doctorID,
		FirstName:      firstName,
		LastName:       lastName,
		ICNo:           icNo,
		Gender:         gender,
		BirthDate:      birthDate,
		MobileNumber:   mobileNumber,
		Email:          email,
		Address:        address,
		Specialisation: specialisation,
	}

	updatedDoctorJSON, err := json.Marshal(updateDoctor)
	if err != nil {
		return fmt.Errorf("failed to marshal updated doctor JSON: %v", err)
	}

	err = ctx.GetStub().PutState(doctorID, updatedDoctorJSON)
	if err != nil {
		return fmt.Errorf("failed to update doctor: %v", err)
	}

	return nil
}

// DeleteDoctor deletes the doctor with the specified ID from the world state.
func (dc *DoctorContract) DeleteDoctor(ctx contractapi.TransactionContextInterface, doctorID string) error {
	exists, err := dc.DoctorExists(ctx, doctorID)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the doctor with ID %s does not exist", doctorID)
	}

	// Delete doctor for the world state
	err = ctx.GetStub().DelState(doctorID)
	if err != nil {
		return fmt.Errorf("failed to delete doctor: %v", err)
	}

	return nil
}

// DoctorExists checks if a doctor with the given ID exists in the world state.
func (dc *DoctorContract) DoctorExists(ctx contractapi.TransactionContextInterface, doctorID string) (bool, error) {
	doctorJSON, err := ctx.GetStub().GetState(doctorID)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return doctorJSON != nil, nil
}

// GetAllDoctors returns all doctors found in world state
func (dc *DoctorContract) GetAllDoctors(ctx contractapi.TransactionContextInterface) ([]*Doctor, error) {
	// Get iterator for all keys in the state
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, fmt.Errorf("failed to get all doctors: %v", err)
	}
	defer resultsIterator.Close()

	// Create a slice to hold all doctors
	var doctors []*Doctor

	// Iterate through the result set
	for resultsIterator.HasNext() {
		// Retrieve the next key/value pair
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to iterate through doctors: %v", err)
		}

		// Unmarshal the doctor JSON into a Doctor object
		var doctor Doctor
		err = json.Unmarshal(response.Value, &doctor)
		if err != nil {
			return nil, fmt.Errorf("failed to unmarshal doctor JSON: %v", err)
		}

		// Append the doctor to the slice
		doctors = append(doctors, &doctor)
	}

	return doctors, nil
}


func main() {
	doctorContract := new(DoctorContract)
	doctorChaincode, err := contractapi.NewChaincode(doctorContract)
	if err != nil {
		log.Panicf("Error creating doctor chaincode %v", err)
	}

	if err := doctorChaincode.Start(); err != nil {
		log.Panicf("Error starting doctor chaincode: %v", err)
	}
}