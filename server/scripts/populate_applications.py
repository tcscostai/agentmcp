from pymongo import MongoClient
from datetime import datetime, timedelta
import random
import faker
import uuid

# MongoDB connection
MONGODB_URI = "mongodb+srv://saurabhdubeyaws:macpro123@cluster0.mrawwvb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "healthcare"
COLLECTION_NAME = "csnp_applications"

# Initialize Faker
fake = faker.Faker()

# Application statuses and types
APPLICATION_STATUSES = ['Pending', 'Under Review', 'Approved', 'Rejected']
CHRONIC_CONDITIONS = [
    "Diabetes Type 2",
    "Chronic Heart Failure",
    "COPD",
    "Hypertension"
]

def generate_application_number():
    """Generate a valid application number"""
    year = "2024"
    number = str(random.randint(1, 9999)).zfill(4)
    return f"APP-{year}-{number}"

def generate_medicare_id():
    """Generate a valid Medicare Beneficiary Identifier (MBI)"""
    chars = '0123456789ACDEFGHJKLMNPQRSTUVWXY'
    nums = '0123456789'
    
    mbi = random.choice(nums)
    mbi += ''.join(random.choice(chars) for _ in range(2))
    mbi += random.choice(nums)
    mbi += '-'
    mbi += ''.join(random.choice(chars) for _ in range(2))
    mbi += random.choice(nums)
    mbi += '-'
    mbi += ''.join(random.choice(chars) for _ in range(2))
    mbi += ''.join(random.choice(nums) for _ in range(2))
    
    return mbi

def generate_application():
    # Generate dates as datetime objects
    application_date = datetime.now() - timedelta(days=random.randint(0, 30))
    dob = datetime.now() - timedelta(days=random.randint(23725, 32850))  # 65-90 years
    
    return {
        "applicationNumber": generate_application_number(),
        "applicationType": "web",
        "medicareId": generate_medicare_id(),
        "submissionDate": application_date,
        "status": random.choice(APPLICATION_STATUSES),
        "applicant": {
            "firstName": fake.first_name(),
            "lastName": fake.last_name(),
            "dateOfBirth": dob,  # Using datetime instead of date
            "email": fake.email(),
            "phone": fake.phone_number(),
            "address": {
                "street": fake.street_address(),
                "city": fake.city(),
                "state": fake.state(),
                "zipCode": fake.zipcode()
            }
        },
        "chronicCondition": random.choice(CHRONIC_CONDITIONS),
        "medications": random.sample([
            "Metformin", "Lisinopril", "Albuterol", "Losartan",
            "Amlodipine", "Furosemide", "Symbicort", "Januvia"
        ], k=random.randint(1, 3)),
        "providers": [{
            "name": fake.name(),
            "specialty": "Primary Care",
            "npi": str(random.randint(1000000000, 9999999999))
        }],
        "documents": {
            "medicareCard": True,
            "identificationCard": True,
            "medicalRecords": random.choice([True, False])
        },
        "notes": [],
        "lastUpdated": datetime.now(),
        "createdAt": application_date
    }

def generate_test_member() -> dict:
    return {
        "applicationNumber": "APP-2024-0001",
        "medicareId": "1AB2CD3EF45",  # Valid Medicare ID format
        "applicant": {
            "firstName": "Sarah",
            "lastName": "Johnson",
            "dateOfBirth": "1955-06-15",
            "gender": "F",
            "email": "sarah.johnson@email.com",
            "phone": "555-123-4567",
            "address": {
                "street": "123 Main Street",
                "city": "Phoenix",
                "state": "AZ",
                "zipCode": "85001"
            }
        },
        "chronicConditions": [
            {
                "name": "Diabetes Type 2",
                "diagnosisDate": "2020-03-15",
                "severity": "Moderate",
                "medications": ["Metformin", "Glipizide"]
            },
            {
                "name": "Hypertension",
                "diagnosisDate": "2019-08-22",
                "severity": "Controlled",
                "medications": ["Lisinopril"]
            }
        ],
        "documents": {
            "medicareCard": {
                "verified": True,
                "verificationDate": "2024-01-15"
            },
            "identificationCard": {
                "verified": True,
                "verificationDate": "2024-01-15"
            },
            "medicalRecords": {
                "verified": True,
                "verificationDate": "2024-01-15"
            },
            "proofOfResidency": {
                "verified": True,
                "verificationDate": "2024-01-15"
            }
        },
        "eligibilityStatus": {
            "medicareEligible": True,
            "ageQualified": True,
            "residencyVerified": True,
            "conditionsQualified": True
        },
        "status": "Pending",
        "submissionDate": "2024-01-15",
        "lastUpdated": "2024-01-15"
    }

def populate_database(num_applications=100):
    try:
        client = MongoClient(MONGODB_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        
        # Clear existing data
        collection.delete_many({})
        
        # Insert test application (Sarah's complete application)
        test_application = generate_test_member()
        collection.insert_one(test_application)
        print("Successfully inserted test application APP-2024-0001")
        
        # Create indexes
        collection.create_index("applicationNumber", unique=True)
        collection.create_index("medicareId", unique=True)
        collection.create_index([("applicant.email", 1)])
        
        return True
    except Exception as e:
        print(f"Error populating database: {str(e)}")
        return False
    finally:
        client.close()

if __name__ == "__main__":
    populate_database() 