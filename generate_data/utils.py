import pandas as pd
import json
import datetime
import random

def get_data(carSpecsPath: str = 'carSpecification.json', cccdPath: str = 'maCCCD.csv', regionPath: str = 'region.json', ttdkPath: str = 'ttdk_result.json', skipTTDK = False):
    carSpecs_df = pd.read_json(carSpecsPath)
    cccd_df = pd.read_csv(cccdPath)
    cccd_df.rename(columns={"STT": "num", "Đơn vị hành chính": "regionName", "Mã tỉnh, thành phố trực thuộc trung ương": "regionCode"}, inplace=True)
    cccd_df.drop(columns=['num'], inplace = True)
    regionCode = cccd_df['regionCode'].to_list()
    newRegionCode=[]
    for i in regionCode:
        str_i = str(i)
        if len(str_i)==1:
            newRegionCode.append("0"+"0"+str_i)
        elif len(str_i)==2:
            newRegionCode.append("0"+str_i)
    cccd_df['newRegionCode'] = newRegionCode
    cccd_df.drop(columns=['regionCode'],inplace=True)
    cccd_df.rename(columns={"newRegionCode": "regionCode"}, inplace=True)
    region_df = pd.read_json(regionPath)
    if not skipTTDK:
        ttdk_df = open(ttdkPath)
        ttdk_df = json.load(ttdk_df)
        ttdk_df = ttdk_df['centers']
        ttdk_df = pd.DataFrame(ttdk_df)
    else:
        ttdk_df =""
    return (carSpecs_df, cccd_df, region_df, ttdk_df)

def get_rand_date(start_date, end_date, iso_format= True):

    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_date = start_date + datetime.timedelta(days=random_number_of_days)
    if iso_format:
        return datetime.datetime.combine(random_date, datetime.datetime.min.time()).isoformat()
    else:
        return datetime.datetime.combine(random_date, datetime.datetime.min.time())

def get_car_exptime(carType, historyCount):
    '''
    Get time car valid with new regis info
    Using regulation of Vietnam from 01/10/2021 (not new, since we're generating old data)
    Return: Months (not days)
    '''
    if carType=="xe con":
        if historyCount==0:
            return 30
        elif historyCount<4:
            return 18
        elif historyCount<9:
            return 12
        else:
            return 6
    elif carType=="xe tải":
        if historyCount==0:
            return 24
        elif historyCount<4:
            return 12
        else:
            return 6
    elif carType=="xe khách":
        if historyCount==0:
            return 18
        else:
            return 6
    else:
        if historyCount==0:
            return 24
        elif historyCount<6:
            return 12
        else:
            return 6
        
def convert_car_type(carType):
    if carType=="Car":
        return "xe con"
    elif carType=="Truck":
        return "xe tải"
    elif carType=="Coach":
        return "xe khách"
    elif carType=="Pickup Truck":
        return "xe bán tải"
    elif carType=="Specialized Vehicle":
        return "xe chuyên dùng"
    else:
        return "kiểu khác"