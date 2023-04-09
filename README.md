WARNING: Because the creation of car has not yet existed,
    there are show vital recommendations:
    - Car creation DOESN'T MEAN it registered
    - Required fields: 
        + organization: True|False
        + ownerName: (organization or personal)
        + licensePlate: 
        + dateOfIssue: Date() object
        + regionName:
        + carName: (e.g. Toyota)
        + carVersion (e.g. khong biet lol)
        + carType: xe tai hay xe con hay xe gi do 
    
    - registrationInformation (thong tin dang kiem) will be set to a dummy object. This vehicle will always showed in "nearExpire" type when searching for car list
    - region name and number must be matched and EXISTED IN REGION SCHEMA (like 14 - Quang Ninh). I will created that db soon.
    - carSpecs must be created before create a new car (similar with reality)

One dummy ttdk named "dummy", one region name named "dummy province"