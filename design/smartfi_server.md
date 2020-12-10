<!-- vscode-markdown-toc -->
* 1. [Vision](#Vision)
* 2. [Requirements break-down](#Requirementsbreak-down)
	* 2.1. [Functional requirements](#Functionalrequirements)
	* 2.2. [Non-functional requirements](#Non-functionalrequirements)
	* 2.3. [Non-Non requirements](#Non-Nonrequirements)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

# 1. Smartfi server system

##  1. <a name='Vision'></a>Vision
Smartfi system enables multiple IOT devices to send its data to common server. This data will be used to visualize and troubleshoot IOT devices under consideration

##  2. <a name='Requirementsbreak-down'></a>Requirements break-down
###  2.1. <a name='Functionalrequirements'></a>Functional requirements
* A client should be able to upload data periodically
* A client should be able to retry data upload
* A client may provide data timestamp and in this case, system should use the same. 
    * Timestamp will be in UNIX format (number of epochs)
    * System will store data marking timestamp, if needed. Timestamp granuality is minute
* Multiple clients should be able to upload data concurrently
* System should store data in such a way that consumer can distinguish among data for each source (client IOT device)
* Only registered client should be able to interact with system 


###  2.2. <a name='Non-functionalrequirements'></a>Non-functional requirements
* Server should be fair in processing multiple client data upload. Upload should be reasonably fast and there should not be any starvation
* Client should not wait while uploading data 
* Client should get success or failure for its request
* Data upload should be atomic (all or none)
* Server should handle  malformed data upload request gracefully and it should not impact availability
* System should be able to cleanup old data(more than 5 years old) so that DB will not overflow. User should be able to configure this value.


###  2.3. <a name='Non-requirements'></a>Non-requirements
* Edit of data which is already uploaded is not considered
* Timestamp granuality more than minute is not considered
