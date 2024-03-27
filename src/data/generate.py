from faker import Faker
import sys
import json
import uuid
import re
import random

NUM_USERS = 10
NUM_EVENTS = 20
FAVOURITE_PROBABILITY = 0.3 # Probability of an event being marked as favorite
EVENT_SEARCH_FIELDS = ['name', 'description', 'location']

EVENT_TYPES = ['Concert', 'Theater', 'Dance', 'Magic', 'Circus']

TICKET_TYPES = {
    'pink': { 'minPrice': 100, 'maxPrice': 200, 'minQuantity': 10, 'maxQuantity': 100 },
    'yellow': { 'minPrice': 200, 'maxPrice': 350, 'minQuantity': 80, 'maxQuantity': 100 },
    'green': { 'minPrice': 70, 'maxPrice': 80, 'minQuantity': 50, 'maxQuantity': 500 },
    'red': { 'minPrice': 50, 'maxPrice': 70, 'minQuantity': 100, 'maxQuantity': 600 },
}

fake = Faker('en_US')

def normalize(text):
    return re.sub(r'[^\w\s]', ' ', text).lower()

def extract_words(text):
    return [x.strip() for x in normalize(text).split(' ') if x]

def extract_event_words(value):
    words = []
    for field in EVENT_SEARCH_FIELDS:
        words.extend(extract_words(value[field]))
    return set(words)

def generate_user_data():
    users = {}
    for _ in range(NUM_USERS):
        username = fake.user_name()
        password = fake.password(length=10, digits=False, upper_case=True, lower_case=True, special_chars=False)
        users[f"user:{username}"] = { 
            "name": fake.name(), "username": username, "email": fake.email(), "password": password, "role": "user" 
        }
    return users

def generate_event_data():
    events = {}
    for _ in range(NUM_EVENTS):
        id = str(uuid.uuid4())
        events[f"event:{id}"] = {
            "name": fake.sentence(nb_words=5),
            "description": fake.paragraph(nb_sentences=4),
            "location": fake.city(),
            "type": random.choice(EVENT_TYPES),
            "date": fake.future_datetime(end_date='+30d').strftime("%d-%m-%Y %H:%M")
        }
    return events

def generate_events_search(events_data):
    search = {}
    for event, details in events_data.items():
        event_id = event.split(':')[1]
        words = extract_event_words(details)
        for word in words:
            word_key = f'search:event:{word}'
            if word_key in search.keys():
                search[word_key].append(event_id)
            else:
                search[word_key] = [event_id]
    return search

def generate_favourites(user_data, event_data):
    favorites = {}
    for user in user_data.keys():
        user_id = user.split(':')[1]
        user_favorites = []
        for event in event_data.keys():
            event_id = event.split(':')[1]
            if random.random() < FAVOURITE_PROBABILITY:
                user_favorites.append(event_id)
        favorites[f'favourite:{user_id}'] = user_favorites
    return favorites

def generate_tickets(event_data):
    tickets = {}
    for event in event_data.keys():
        event_id = event.split(':')[1]
        for type, details in TICKET_TYPES.items():
            quantity = random.randint(details['minQuantity'], details['maxQuantity'])
            tickets[f'ticket:{event_id}:{type}'] = {
                "total_quantity" : quantity,
                "current_quantity" : quantity,
                "price" : round(random.uniform(details['minPrice'], details['maxPrice']), 2),
            }
    return tickets

def main():

    if len(sys.argv) != 2:
        print("Usage: python generate.py <OUTPUT>")
        sys.exit(1)

    JSON_FILE = sys.argv[1]

    user_data = generate_user_data()
    event_data = generate_event_data()
    event_search = generate_events_search(event_data)
    favourites_data = generate_favourites(user_data, event_data)
    tickets_data = generate_tickets(event_data)

    data = { 
        **user_data, 
        **event_data, 
        **event_search, 
        **favourites_data,
        **tickets_data,
    }

    with open(JSON_FILE, "w") as file:
        json.dump(data, file, indent=2)
        file.close()

if __name__ == "__main__":
    main()
