# Chatbot-for-medical-conditions
ReactJs mobile app for patient-specific medical conditions. 

This app was created as a final year project module of BSc Computer Science (Hons). 
The chatbot uses AWS Comprehend and NLP to identify certain medical symptoms. 
A relation between user(patient), medical_conditions, medical_symptoms and patient_conditions(inlcuding red and amber flags) are created in DynamoDB.
These medical symptons populates and compares against preset conditions stored into patient database.
Admin(doctor) account has ability to view all patient information and gets notified when symptom checker has been used and/or identified a flagged symptom.

![alt text](https://github.com/DivTheDev/Chatbot-for-medical-conditions/blob/master/medimate.jpg)
