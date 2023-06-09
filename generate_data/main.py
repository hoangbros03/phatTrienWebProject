import argparse
from car_gen import *
from ttdk_gen import *
    
parser = argparse.ArgumentParser(description='Process the generation.')

parser.add_argument("typeToGenerate", type=str, help="type of data you want to generate (only 'cars' or 'ttdks')")

parser.add_argument(
    "-cs",
    "--carSpec",
    type=str,
    dest="carSpecPath",
    help="path of car specification",
    default="carSpecification.json",
)
parser.add_argument(
    "-c",
    "--cccd",
    type=str,
    dest="cccdPath",
    help="path of cccd csv",
    default="maCCCD.csv",
)
parser.add_argument(
    "-r",
    "--region",
    type=str,
    dest="regionPath",
    help="path of region json",
    default="region.json",
)
parser.add_argument(
    "-t",
    "--ttdk",
    type=str,
    dest="ttdkPath",
    help="path of ttdk",
    default="ttdk_result.json",
)

parser.add_argument(
    "-s",
    "--sample",
    type=int,
    dest="sample",
    help="sample per region or sample of cars, based on type you choose",
    default="7",
)

parser.add_argument(
    "-o",
    "--output",
    type=str,
    dest="outputName",
    help="name of the output file, must be .json",
    default="ttdk_result.json",
)

parser.add_argument('-v', '--verbose', action='store_true',
                    help='Show process')


if __name__=="__main__":
    args = parser.parse_args()
    if args.outputName.split('.')[-1]!="json":
        print("output file name invalid!")
    else:
        if(args.typeToGenerate=="ttdks"):
            _,_,region_df,_ = get_data(args.carSpecPath, args.cccdPath, args.regionPath, args.ttdkPath, skipTTDK=True)
            ttdk_generator(region_df,args.sample,args.outputName,args.verbose)
        elif(args.typeToGenerate=="cars"):
            data = get_data(args.carSpecPath, args.cccdPath, args.regionPath, args.ttdkPath)
            car_and_owner_generation(data, args.sample, args.outputName, args.verbose)
        else:
            print("Wrong type to generate")