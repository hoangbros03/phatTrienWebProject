import pandas as pd
import json
import datetime
import random
from random_strings import random_string
from utils import *
import copy
from vn_fullname_generator import generator

def car_and_owner_generation(data_get, sample = 10,file_name = "result.json", verbose = True):
    carSpecs_df, cccd_df, region_df, ttdk_df = data_get
    list = []
    alphabet = ['A','B','C','D','E','F','G','H']
    for i in range(sample):
        # Init
        info = {}
        info['paperOfRecognition'] = {}
        info['carOwner'] = {}
        info['registrationInformation'] = {}
        info['carSpecification'] = {}
        info['historyRegistrationInformation'] = []
        # Rand variables
        num_in_regiondf = random.randrange(0,76)
        num_in_carspecs = random.randrange(0,33)
        # License Plate and other
        info['regionName'] = region_df.iloc[num_in_regiondf,0]
        info['licensePlate'] = str(region_df.iloc[num_in_regiondf,1])+ alphabet[random.randrange(0,len(alphabet))]+ "-"+str(random.randrange(100,1000))+"."+str(random.randrange(10,100))
        info['producer'] = carSpecs_df.iloc[num_in_carspecs,3]
        info['version'] = carSpecs_df.iloc[num_in_carspecs,1]
        info['engineNo'] = random_string(10).upper()
        info['classisNo'] = random_string(10).upper()
        # Paper of recognition
        dateOfIssue = get_rand_date(datetime.date(2010,1,1), datetime.date(2023,5,1), iso_format=False)
        dateOfIssueISO = dateOfIssue.isoformat()
        info['paperOfRecognition']['dateOfIssue'] = dateOfIssueISO
        # Car owner
        info['carOwner']['organization'] = True if random.random()>0.7 else False
        gender = round(random.random())
        nameRandom = generator.generate(gender)
        info['carOwner']['name']= nameRandom
        info['carOwner']['address']= str(random.randrange(1,50)) + " " + region_df.iloc[num_in_regiondf,0]
        info['carOwner']['ID'] = cccd_df[cccd_df['regionName']==info['regionName']]['regionCode'].values[0] + "".join(str(random.randrange(0,10)) for i in range(9))
        # Car specification
        info['carSpecification']['name'] = carSpecs_df.iloc[num_in_carspecs,0]
        info['carSpecification']['version'] = carSpecs_df.iloc[num_in_carspecs,1]
        info['carSpecification']['type'] = convert_car_type(carSpecs_df.iloc[num_in_carspecs,2])
        info['carSpecification']['producer'] = carSpecs_df.iloc[num_in_carspecs,3]
        info['carSpecification']['numberOfSeats'] = str(carSpecs_df.iloc[num_in_carspecs,4])
        info['carSpecification']['width']=str(carSpecs_df.iloc[num_in_carspecs,5])
        info['carSpecification']['height']=str(carSpecs_df.iloc[num_in_carspecs,6])
        info['carSpecification']['power']=str(carSpecs_df.iloc[num_in_carspecs,7])
        
        # Get ttdk_df within this region
        sample_ttdk_df = ttdk_df[ttdk_df['regionName']==info['regionName']]
       
        # Choose if this car should be stick to one ttdk or not
        stick_ttdk = True if random.random()>0.5 else False
        if stick_ttdk:
            ttdk_stick_idx = random.randrange(0, len(sample_ttdk_df))
        history_reginfo = []
        history_count =0
        # History registration information
        lastestDate = dateOfIssue
        while lastestDate< datetime.datetime.combine(datetime.date.today(), datetime.datetime.min.time()):
            # Create registration information
            reginfo = {}
            # Basic info
            reginfo['licensePlate'] = info['licensePlate']
            reginfo['ownerName'] = nameRandom
            reginfo['carType'] = info['carSpecification']['type']
            # Regis place
            reginfo['regionName'] = info['regionName']
            if stick_ttdk:
                reginfo['trungTamDangKiemName'] = sample_ttdk_df.iloc[ttdk_stick_idx,0]
            else:
                reginfo['trungTamDangKiemName'] = sample_ttdk_df.iloc[random.randrange(0, len(sample_ttdk_df)),0]
            # Time
            months_valid =get_car_exptime(info['carSpecification']['type'], history_count)
            reginfo['dateOfIssue'] = lastestDate.isoformat()
            lastestDate = lastestDate + datetime.timedelta(days=months_valid*30)
            reginfo['dateOfExpiry'] = lastestDate.isoformat()
            # append
            history_reginfo.append(reginfo)
            # increment
            history_count+=1
        info['historyRegistrationInformation'] = history_reginfo
        # Modify a bit newest reginfo
        current_reginfo = copy.deepcopy(history_reginfo[-1])
        current_reginfo['trungTamDangKiem']={}
        current_reginfo['trungTamDangKiem']['name'] = current_reginfo['trungTamDangKiemName']
        current_reginfo['trungTamDangKiem']['regionName'] = current_reginfo['regionName']
        del current_reginfo['trungTamDangKiemName']
        del current_reginfo['regionName']
        info['registrationInformation'] = current_reginfo
        
        
        list.append(info)
        if(i%1000==0 and verbose):
            print(f"Done {i}/{sample} cars")
    result = {"status": list}
    print(result) if sample==1 else None
    with open(file_name, "w") as f:
        f.write(json.dumps(result, indent=4, ensure_ascii=False))
    return list