package main

import (
	"encoding/json"
	"fmt"
	"log"
	"reflect"
	"strings"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// DoctorContract to define the smart contract
type DoctorContract struct {
	contractapi.Contract
}

// Doctor struct to store doctor psersonal information
type Doctor struct {
	DoctorID                   string `json:"doctor_id"`
	FirstName                  string `json:"first_name"`
	LastName                   string `json:"last_name"`
	ICNo                       string `json:"ic_no"`
	Gender                     string `json:"gender"`
	BirthDate                  string `json:"birth_date"`
	MobileNumber               string `json:"mobile_number"`
	Email                      string `json:"email"`
	Address                    string `json:"address"`
	Specialisation             string `json:"specialisation"`
	Degree                     string `json:"degree"`
	RecognizedDate             string `json:"recognize_date"`
	Country                    string `json:"country"`
	Institution                string `json:"institution"`
	BodyGrantingQualifications string `json:"body_granting_qualifications"`
	//Certificate                []byte    `json:"certificate"`
}

type TransactionLog struct {
	TransactionID string    `json:"transactionID"`
	Caller        string    `json:"caller"`
	ActionItem    string    `json:"action_item"`
	Timestamp     time.Time `json:"timestamp"`
}

// CreateDoctor creates a new doctor with the provided information and stores it in the world state
func (dc *DoctorContract) CreateDoctor(ctx contractapi.TransactionContextInterface, doctorID string, firstName string, lastName string,
	icNo string, gender string, birthDate string, mobileNumber string, email string, address string, specialisation string, degree string,
	recognizedDate string, country string, institution string, bodyGrantingQualification string) error {

	// Check if client has 'admin' role
	err := ctx.GetClientIdentity().AssertAttributeValue("DMSrole", "admin")
	if err != nil {
		return fmt.Errorf("only admin can create doctor")
	}

	//Check if the doctor already exists
	_, exists, err := dc.DoctorExists(ctx, doctorID)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the doctor with ID %s already exists", doctorID)
	}

	// Get createBy (caller)
	caller, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return fmt.Errorf("failed to get caller ID: %v", err)
	}

	//get timestamp
	txTimestamp, err := ctx.GetStub().GetTxTimestamp()
	if err != nil {
		return fmt.Errorf("failed to get transaction timestamp: %v", err)
	}
	timestamp := time.Unix(txTimestamp.Seconds, int64(txTimestamp.Nanos))

	//get transaction ID
	transactionID := ctx.GetStub().GetTxID()

	//get information about creating a doctor account
	actionItem := fmt.Sprintf("Register New Doctor: %s", doctorID)

	newDoctor := Doctor{
		DoctorID:                   doctorID,
		FirstName:                  firstName,
		LastName:                   lastName,
		ICNo:                       icNo,
		Gender:                     gender,
		BirthDate:                  birthDate,
		MobileNumber:               mobileNumber,
		Email:                      email,
		Address:                    address,
		Specialisation:             specialisation,
		Degree:                     degree,
		RecognizedDate:             recognizedDate,
		Country:                    country,
		Institution:                institution,
		BodyGrantingQualifications: bodyGrantingQualification,
	}

	transactionLog := TransactionLog{
		TransactionID: transactionID,
		Caller:        caller,
		ActionItem:    actionItem,
		Timestamp:     timestamp,
	}

	// Marshal transaction log
	transactionLogJSON, err := json.Marshal(transactionLog)
	if err != nil {
		return fmt.Errorf("failed to marshal transaction log: %v", err)
	}

	// Put transaction log to world state
	err = ctx.GetStub().PutState(transactionID, transactionLogJSON)
	if err != nil {
		return fmt.Errorf("failed to store transaction log: %v", err)
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
	icNo string, gender string, birthDate string, mobileNumber string, email string, address string, specialisation string, degree string,
	recognizedDate string, country string, institution string, bodyGrantingQualification string) error {

	currentDoctorJSON, exists, err := dc.DoctorExists(ctx, doctorID)
	if err != nil {
		return fmt.Errorf("failed to read doctor from world state: %v", err)
	}
	if !exists {
		return fmt.Errorf("the doctor with ID %s does not exist", doctorID)
	}

	// Get updatedBy (caller)
	caller, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return fmt.Errorf("failed to get caller ID: %v", err)
	}

	//get timestamp
	txTimestamp, err := ctx.GetStub().GetTxTimestamp()
	if err != nil {
		return fmt.Errorf("failed to get transaction timestamp: %v", err)
	}
	timestamp := time.Unix(txTimestamp.Seconds, int64(txTimestamp.Nanos))

	//get transaction ID
	transactionID := ctx.GetStub().GetTxID()

	// Unmarshal current doctor details
	var currentDoctor Doctor
	if err := json.Unmarshal(currentDoctorJSON, &currentDoctor); err != nil {
		return fmt.Errorf("failed to unmarshal existing doctor JSON: %v", err)
	}

	updateDoctor := Doctor{
		DoctorID:                   doctorID,
		FirstName:                  firstName,
		LastName:                   lastName,
		ICNo:                       icNo,
		Gender:                     gender,
		BirthDate:                  birthDate,
		MobileNumber:               mobileNumber,
		Email:                      email,
		Address:                    address,
		Specialisation:             specialisation,
		Degree:                     degree,
		RecognizedDate:             recognizedDate,
		Country:                    country,
		Institution:                institution,
		BodyGrantingQualifications: bodyGrantingQualification,
	}

	// Compare existing and updated doctor objects to find modified fields
	updatedFields := make(map[string]interface{})
	existingFields := reflect.ValueOf(currentDoctor)
	updatedFieldsVal := reflect.ValueOf(updateDoctor)
	for i := 0; i < existingFields.NumField(); i++ {
		existingVal := existingFields.Field(i).Interface()
		updatedVal := updatedFieldsVal.Field(i).Interface()
		if !reflect.DeepEqual(existingVal, updatedVal) {
			fieldName := strings.ToLower(existingFields.Type().Field(i).Name)
			updatedFields[fieldName] = fmt.Sprintf("%s: %v -> %v", fieldName, existingVal, updatedVal)
		}
	}

	// Marshal updated fields
	// updatedFieldsJSON, err := json.Marshal(updatedFields)
	//if err != nil {
	// return fmt.Errorf("failed to marshal updated fields JSON: %v", err)
	// }

	// get update fileds
	var actionItem string
	for _, val := range updatedFields {
		actionItem += fmt.Sprintf("%v; ", val)
	}
	actionItem = strings.TrimSuffix(actionItem, "; ")

	transactionLog := TransactionLog{
		TransactionID: transactionID,
		Caller:        caller,
		ActionItem:    actionItem,
		Timestamp:     timestamp,
	}

	// Marshal transaction log
	transactionLogJSON, err := json.Marshal(transactionLog)
	if err != nil {
		return fmt.Errorf("failed to marshal transaction log: %v", err)
	}

	// Put transaction log to world state
	err = ctx.GetStub().PutState(transactionID, transactionLogJSON)
	if err != nil {
		return fmt.Errorf("failed to put transaction log: %v", err)
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

	// Check if client has 'admin' role
	err := ctx.GetClientIdentity().AssertAttributeValue("DMSrole", "admin")
	if err != nil {
		return fmt.Errorf("only admin can delete doctor")
	}

	_, exists, err := dc.DoctorExists(ctx, doctorID)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the doctor with ID %s does not exist", doctorID)
	}

	// Get deleteBy (caller)
	caller, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return fmt.Errorf("failed to get caller ID: %v", err)
	}

	//get timestamp
	txTimestamp, err := ctx.GetStub().GetTxTimestamp()
	if err != nil {
		return fmt.Errorf("failed to get transaction timestamp: %v", err)
	}
	timestamp := time.Unix(txTimestamp.Seconds, int64(txTimestamp.Nanos))

	//get transaction ID
	transactionID := ctx.GetStub().GetTxID()

	//get action about delete a doctor
	actionItem := fmt.Sprintf("Delete Doctor : %s", doctorID)

	transactionLog := TransactionLog{
		TransactionID: transactionID,
		Caller:        caller,
		ActionItem:    actionItem,
		Timestamp:     timestamp,
	}

	// Marshal transaction log
	transactionLogJSON, err := json.Marshal(transactionLog)
	if err != nil {
		return fmt.Errorf("failed to marshal transaction log: %v", err)
	}

	// Put transaction log to world state
	err = ctx.GetStub().PutState(transactionID, transactionLogJSON)
	if err != nil {
		return fmt.Errorf("failed to store transaction log: %v", err)
	}

	// Delete doctor for the world state
	err = ctx.GetStub().DelState(doctorID)
	if err != nil {
		return fmt.Errorf("failed to delete doctor: %v", err)
	}

	return nil
}

// DoctorExists checks if a doctor with the given ID exists in the world state.
func (dc *DoctorContract) DoctorExists(ctx contractapi.TransactionContextInterface, doctorID string) ([]byte, bool, error) {
	doctorJSON, err := ctx.GetStub().GetState(doctorID)
	if err != nil {
		return nil, false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return doctorJSON, doctorJSON != nil, nil
}

// GetTransactionLogs returns all transaction logs in world state
func (dc *DoctorContract) GetTransactionLogs(ctx contractapi.TransactionContextInterface) ([]*TransactionLog, error) {
	// Check if client has 'admin' role
	err := ctx.GetClientIdentity().AssertAttributeValue("DMSrole", "admin")
	if err != nil {
		return nil, fmt.Errorf("only admin can get all doctors")
	}

	// Get iterator for all keys in the state
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, fmt.Errorf("failed to get transaction log: %v", err)
	}
	defer resultsIterator.Close()

	// Initialize an empty slice to store transaction logs
	var transactionLogs []*TransactionLog

	//Iterate through the result set
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to iterate through transaction logs: %v", err)
		}

		// Unmarshal the transaction log into a TransactionLog object
		var transactionLog TransactionLog
		if err := json.Unmarshal(response.Value, &transactionLog); err != nil {
			return nil, fmt.Errorf("failed to unmarshal transaction log: %v", err)
		}

		// Append the transaction log to the slice
		transactionLogs = append(transactionLogs, &transactionLog)

	}

	return transactionLogs, nil
}

// GetAllDoctors returns all doctors found in world state
func (dc *DoctorContract) GetAllDoctors(ctx contractapi.TransactionContextInterface) ([]*Doctor, error) {

	// Check if client has 'admin' role
	err := ctx.GetClientIdentity().AssertAttributeValue("DMSrole", "admin")
	if err != nil {
		return nil, fmt.Errorf("only admin can get all doctors")
	}

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

// CountDoctors returns the total number of doctors
func (dc *DoctorContract) CountDoctors(ctx contractapi.TransactionContextInterface) (int, error) {
	// Get all doctor records
	doctorIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return 0, fmt.Errorf("failed to read from world state: %v", err)
	}
	defer doctorIterator.Close()

	count := 0

	// Iteration of doctors, counting the number
	for doctorIterator.HasNext() {
		_, err := doctorIterator.Next()
		if err != nil {
			return 0, fmt.Errorf("failed to iterate doctor iterator: %v", err)
		}
		count++
	}

	return count, nil
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
