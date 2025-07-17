from pymongo import MongoClient
import random
from datetime import datetime, timedelta
import names
import faker

# MongoDB connection
MONGODB_URI = "mongodb+srv://saurabhdubeyaws:macpro123@cluster0.mrawwvb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "healthcare"
COLLECTION_NAME = "csnp_members"

# Initialize Faker
fake = faker.Faker()

# Sample data lists
CHRONIC_CONDITIONS = [
    "Diabetes Type 2",
    "Chronic Heart Failure",
    "COPD",
    "Hypertension",
    "Major Depressive Disorder",
    "End-Stage Renal Disease",
    "Rheumatoid Arthritis",
    "Multiple Sclerosis"
]

MEDICATIONS = {
    "Diabetes Type 2": ["Metformin", "Glipizide", "Januvia"],
    "Chronic Heart Failure": ["Lisinopril", "Carvedilol", "Furosemide"],
    "COPD": ["Albuterol", "Spiriva", "Symbicort"],
    "Hypertension": ["Amlodipine", "Losartan", "Hydrochlorothiazide"],
    "Major Depressive Disorder": ["Sertraline", "Bupropion", "Fluoxetine"],
    "End-Stage Renal Disease": ["Epogen", "Calcitriol", "Sensipar"],
    "Rheumatoid Arthritis": ["Methotrexate", "Humira", "Prednisone"],
    "Multiple Sclerosis": ["Copaxone", "Tecfidera", "Ocrevus"]
}

COMMUNICATION_PREFERENCES = ["Phone", "Email", "SMS", "Mail"]

def generate_member():
    # Generate random date of birth for someone between 65 and 90 years old
    age = random.randint(65, 90)
    dob = datetime.now() - timedelta(days=age*365)
    
    # Select random chronic conditions (1-3 conditions)
    conditions = random.sample(CHRONIC_CONDITIONS, random.randint(1, 3))
    
    # Generate medications based on conditions
    medications = []
    for condition in conditions:
        medications.extend(random.sample(MEDICATIONS[condition], random.randint(1, len(MEDICATIONS[condition]))))
    
    # Generate member data
    member = {
        "memberId": f"CSNP{random.randint(100000, 999999)}",
        "name": names.get_full_name(),
        "dateOfBirth": dob,
        "address": {
            "street": fake.street_address(),
            "city": fake.city(),
            "state": fake.state(),
            "zipCode": fake.zipcode()
        },
        "phoneNumber": fake.phone_number(),
        "email": fake.email(),
        "chronicConditions": conditions,
        "primaryCareProvider": {
            "name": names.get_full_name(),
            "npi": f"{random.randint(1000000000, 9999999999)}",
            "clinic": fake.company() + " Medical Center"
        },
        "medications": medications,
        "eligibilityDocuments": [
            {
                "type": "Medicare Card",
                "verified": random.choice([True, False]),
                "expirationDate": datetime.now() + timedelta(days=random.randint(365, 730))
            },
            {
                "type": "Medical Records",
                "verified": random.choice([True, False]),
                "lastUpdated": datetime.now() - timedelta(days=random.randint(0, 90))
            }
        ],
        "preferredCommunication": random.choice(COMMUNICATION_PREFERENCES),
        "enrollmentStatus": random.choice(["Pending", "Active", "Under Review"]),
        "lastAssessmentDate": datetime.now() - timedelta(days=random.randint(0, 180)),
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    }
    return member

def generate_test_member():
    return {
        "memberId": "CSNP888999",
        "name": "Sarah Johnson",
        "dateOfBirth": datetime.now() - timedelta(days=70*365),  # 70 years old
        "address": {
            "street": "123 Healthcare Ave",
            "city": "Medicare City",
            "state": "California",
            "zipCode": "90210"
        },
        "phoneNumber": "555-123-4567",
        "email": "sarah.johnson@email.com",
        "chronicConditions": [
            "Diabetes Type 2",
            "Hypertension",
            "COPD"
        ],
        "primaryCareProvider": {
            "name": "Dr. Michael Smith",
            "npi": "1234567890",
            "clinic": "Wellness Medical Center"
        },
        "medications": [
            "Metformin",
            "Lisinopril",
            "Symbicort",
            "Albuterol"
        ],
        "eligibilityDocuments": [
            {
                "type": "Medicare Card",
                "verified": True,
                "expirationDate": datetime.now() + timedelta(days=730)
            },
            {
                "type": "Medical Records",
                "verified": True,
                "lastUpdated": datetime.now() - timedelta(days=30)
            }
        ],
        "preferredCommunication": "Phone",
        "enrollmentStatus": "Active",
        "lastAssessmentDate": datetime.now() - timedelta(days=30),
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    }

def generate_test_member_unverified():
    return {
        "memberId": "CSNP749117",
        "name": "Ruth Kalichman",
        "dateOfBirth": datetime.now() - timedelta(days=70*365),
        "address": {
            "street": "41933 Donaldson Spring",
            "city": "Joannaville",
            "state": "Nevada",
            "zipCode": "53214"
        },
        "phoneNumber": "+1-769-431-5986",
        "email": "halldaniel@example.org",
        "chronicConditions": ["End-Stage Renal Disease"],
        "primaryCareProvider": {
            "name": "Bo Trammel",
            "npi": "7514865582",
            "clinic": "Cook PLC Medical Center"
        },
        "medications": ["Epogen", "Calcitriol", "Sensipar"],
        "eligibilityDocuments": [
            {
                "type": "Medicare Card",
                "verified": False,
                "expirationDate": datetime.now() + timedelta(days=730)
            },
            {
                "type": "Medical Records",
                "verified": False,
                "lastUpdated": datetime.now() - timedelta(days=30)
            }
        ],
        "preferredCommunication": "SMS",
        "enrollmentStatus": "Under Review",
        "lastAssessmentDate": datetime.now() - timedelta(days=30),
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    }

def populate_database(num_members=100):
    try:
        client = MongoClient(MONGODB_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        
        # Clear existing data
        collection.delete_many({})
        
        # Insert our test members
        test_member_sarah = generate_test_member()  # The verified one (Sarah)
        test_member_ruth = generate_test_member_unverified()  # The unverified one (Ruth)
        
        collection.insert_many([test_member_sarah, test_member_ruth])
        print("Successfully inserted test members")
        
        # Generate and insert regular members
        members = [generate_member() for _ in range(num_members - 2)]
        result = collection.insert_many(members)
        
        print(f"Successfully inserted {len(result.inserted_ids)} members")
        
        # Create indexes
        collection.create_index("memberId", unique=True)
        collection.create_index("chronicConditions")
        collection.create_index("enrollmentStatus")
        
        return True
    except Exception as e:
        print(f"Error populating database: {str(e)}")
        return False
    finally:
        client.close()

if __name__ == "__main__":
    populate_database() 