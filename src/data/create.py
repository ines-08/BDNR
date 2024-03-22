from faker import Faker
import json
import sys
import uuid


NUM_USERS = 10
NUM_EVENTS = 10
fake = Faker('en_US')

def generate_user_data():
    users = {}
    for _ in range(NUM_USERS):
        username = fake.user_name()
        password = fake.password(length=10, digits=False, upper_case=True, lower_case=True, special_chars=False)
        users[f"user:{username}"] = { 
            "name": fake.name(), "username": username, "password": password, "role": "user" 
        } 
    return users

def generate_event_data():
    events = {}
    for _ in range(NUM_EVENTS):
        id = str(uuid.uuid4())
        events[f"event:{id}"] = {
            "name": fake.sentence(nb_words=5),
            "description": fake.paragraph(nb_sentences=4),
            "location": fake.city()
        }
    return events

def generate_events_search(events_data):
    # TODO
    return {}

def main():

    if len(sys.argv) != 2:
        print("Usage: python create.py <output JSON file path>")
        sys.exit(1)

    JSON_FILE = sys.argv[1]
    user_data = generate_user_data()
    event_data = generate_event_data()
    event_search = generate_events_search(event_data)
    data = { **user_data, **event_data, **event_search }

    with open(JSON_FILE, "w") as file:
        json.dump(data, file, indent=2)
        file.close()

if __name__ == "__main__":
    main()
