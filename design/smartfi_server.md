<!-- TOC -->autoauto- [1. Smartfi server system](#1-smartfi-server-system)auto    - [1.1. <a name='Vision'></a>Vision](#11-a-namevisionavision)auto    - [1.2. <a name='Requirementsbreak-down'></a>Requirements break-down](#12-a-namerequirementsbreak-downarequirements-break-down)auto        - [1.2.1. <a name='Functionalrequirements'></a>Functional requirements](#121-a-namefunctionalrequirementsafunctional-requirements)auto        - [1.2.2. <a name='Non-functionalrequirements'></a>Non-functional requirements](#122-a-namenon-functionalrequirementsanon-functional-requirements)auto        - [1.2.3. <a name='Non Requirements'></a>Non-Non requirements](#123-a-namenon-requirementsanon-non-requirements)autoauto<!-- /TOC -->
# 1. Smartfi server system

## 1.1. <a name='Vision'></a>Vision
Smartfi system enables multiple IOT devices to send its data to common server. This data will be used to visualize and troubleshoot IOT devices under consideration

## 1.2. <a name='Requirementsbreak-down'></a>Requirements break-down
### 1.2.1. <a name='Functionalrequirements'></a>Functional requirements
* A client should be able to upload data periodically
* A client should be able to retry data upload
* System will store data marking timestamp. Timestamp granuality is minute
* Multiple clients should be able to upload data concurrently
* System should store data in such a way that consumer can distinguish among data for each source (client IOT device)
* Only registered client should be able to interact with system 

### 1.2.2. <a name='Non-functionalrequirements'></a>Non-functional requirements
* Server should be fair in processing multiple client data upload. Upload should be reasonably fast and there should not be any starvation
* Client should not wait while uploading data 
* Client should get success or failure for its request
* Data upload should be atomic (all or none)
* Server should handle  malformed data upload request gracefully and it should not impact availability

### 1.2.3. <a name='Non Requirements'></a>Non-Non requirements
* Edit of data which is already uploaded is not considered
* Timestamp granuality more than minute is not considered
