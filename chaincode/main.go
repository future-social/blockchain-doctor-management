package main

import (
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"log"
)

func main() {
	doctorContract := new(DoctorContract)
	doctorChaincode, err := contractapi.NewChaincode(doctorContract)
	if err != nil {
		log.Panicf("Error creating doctor chaincode %v", err)
	}

	appointmentContract := new(AppointmentContract)
	appointmentChaincode, err := contractapi.NewChaincode(appointmentContract)
	if err != nil {
		log.Panicf("Error creating appointment chaincode %v", err)
	}

	if err := doctorChaincode.Start(); err != nil {
		log.Panicf("Error starting doctor chaincode: %v", err)
	}

	if err := appointmentChaincode.Start(); err != nil {
		log.Panicf("Error starting appointment chaincode: %v", err)
	}
}
