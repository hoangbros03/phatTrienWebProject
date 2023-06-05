import random
from utils import *

def ttdk_generator(region_df, sample_per_region=7, file_name = "ttdk_result.json", verbose = False, skip_code = ['16','31','32','40','41','51','52','53','54','55','56','57','58','59']):
    list = []
    alphabet = ['D','V','S']
    for i in range(sample_per_region):
        for j in range(80):
            if str(region_df.iloc[j,1]) in skip_code:
                continue
            # init
            info ={}
            i_correct = str(i) if i>10 else str("0"+str(i+1)) 
            code = str(region_df.iloc[j,1])+ i_correct + alphabet[random.randrange(0,len(alphabet))]
            info['name'] = "Trung tâm đăng kiểm xe cơ giới " + code
            info['user'] = "admin" + code
            info['password']  = "123456"
            info['regionName'] = region_df.iloc[j,0]
            info['forgotPassword'] = False
            info['refreshToken']=""
            list.append(info)
        if verbose:
            print("Done " + str(i+1) + "/" + str(sample_per_region) + " samples.")
    result = {"centers": list}
    print(result)
    with open(file_name, "w") as f:
        f.write(json.dumps(result, indent=4, ensure_ascii=False))
    return result
        