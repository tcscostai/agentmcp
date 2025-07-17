from pymongo import MongoClient

MONGODB_URI = "mongodb+srv://saurabhdubeyaws:macpro123@cluster0.mrawwvb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "healthcare"
COLLECTION_NAME = "csnp_applications"

def verify_test_application():
    try:
        client = MongoClient(MONGODB_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        
        # Look for the test application
        test_app = collection.find_one({"applicationNumber": "APP-2024-0001"})
        
        if test_app:
            print("Test application found:")
            print(f"Application Number: {test_app['applicationNumber']}")
            print(f"Medicare ID: {test_app['medicareId']}")
            print(f"Applicant: {test_app['applicant']['firstName']} {test_app['applicant']['lastName']}")
        else:
            print("Test application not found!")
            
        # Count all applications
        total_apps = collection.count_documents({})
        print(f"\nTotal applications in database: {total_apps}")
        
        # Show a few sample application numbers
        print("\nSample application numbers:")
        for app in collection.find().limit(5):
            print(app['applicationNumber'])
            
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    verify_test_application() 