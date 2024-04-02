from faker import Faker
import sys
import json
import uuid
import re
import random

NUM_USERS = 10
NUM_EVENTS = 10

ADMIN_PROBABILITY = 0.1             # User admin probability
FAVOURITE_PROBABILITY = 0.3         # Probability that a user marks an event as favorite given the event
EVENT_PURCHASE_LIMIT = 3            # Maximum number of times a user purchases from the same event
EVENT_PURCHASE_PROBABILITY = 0.5    # Probability that a user purchases any ticket given the event
TICKET_PURCHASE_PROBABILITY = 0.5   # Probability that a user purchases a specific type of ticket
NOTIFICATION_PROBABILITY = 0.3      # Probability to active a notification given the event

EVENT_SEARCH_FIELDS = ['name', 'description', 'location']

EVENT_LOCATIONS = ['Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra', 'Évora', 'Faro',
                    'Guarda', 'Leiria', 'Lisboa', 'Portalegre', 'Porto', 'Santarém', 'Setúbal','Viana do Castelo',
                    'Vila Real', 'Viseu', 'Açores', 'Madeira'
                    ]
                    
EVENT_TYPES = ['concert', 'theater', 'dance', 'magic', 'circus']

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
        role = 'admin' if random.random() < ADMIN_PROBABILITY else 'user'
        users[f"user:{username}"] = { 
            "name": fake.name(), "email": fake.email(), "password": password, "role": role 
        }
    return users

def generate_event_data():
    events = {}
    for _ in range(NUM_EVENTS):
        id = str(uuid.uuid4())
        events[f"event:{id}"] = {
            "name": fake.sentence(nb_words=5).replace('.', ''),
            "description": fake.paragraph(nb_sentences=4),
            "location": random.choice(EVENT_LOCATIONS),
            "type": random.choice(EVENT_TYPES),
            "date": fake.future_datetime(end_date='+30d').strftime("%d-%m-%Y %H:%M"),
            "current_quantity": 0,
        }
    return events

def generate_text_search(events_data):
    search = {}
    for event, details in events_data.items():
        event_id = event.split(':')[1]
        words = extract_event_words(details)
        for word in words:
            word_key = f'search:text:{word}'
            if word_key in search.keys():
                search[word_key].append(event_id)
            else:
                search[word_key] = [event_id]
    return search

def generate_type_search(events_data):
    search = {}
    for type in EVENT_TYPES:
        search[f'search:type:{type}'] = []

    for event, details in events_data.items():
        event_id = event.split(':')[1]
        search[f"search:type:{details['type']}"].append(event_id)

    return search

def generate_location_search(events_data):
    search = {}
    for location in EVENT_LOCATIONS:
        search[f'search:location:{location}'] = []

    for event, details in events_data.items():
        event_id = event.split(':')[1]
        search[f"search:location:{details['location']}"].append(event_id)

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
        current_quantity = 0
        event_id = event.split(':')[1]
        for type, details in TICKET_TYPES.items():
            quantity = random.randint(details['minQuantity'], details['maxQuantity'])
            current_quantity += quantity
            tickets[f'ticket:{event_id}:{type}'] = {
                "total_quantity" : quantity,
                "current_quantity" : quantity,
                "price" : round(random.uniform(details['minPrice'], details['maxPrice']), 2),
            }
        event_data[event]['current_quantity'] = current_quantity
    return tickets

def generate_purchases(user_data, event_data, tickets_data):
    purchases = {}
    for user in user_data.keys():
        user_id = user.split(':')[1]
        for event in event_data.keys():
            event_id = event.split(':')[1]
            event_purchases = [] # [{ date, tickets }]

            # Simulate the probability of having a purchase for a certain event
            if random.random() < EVENT_PURCHASE_PROBABILITY:

                # Simulate multiple purchases for the same event
                for _ in range(0, random.randint(1, EVENT_PURCHASE_LIMIT)):
                    purchase_tickets = [] # [{type, quantity}]
                    for type in TICKET_TYPES.keys():

                        # Simulate the probability of selecting a certain ticket type(s)
                        if random.random() < TICKET_PURCHASE_PROBABILITY:
                            ticket_id = f"ticket:{event_id}:{type}"

                            # If possible, generate purchase
                            if tickets_data[ticket_id]['current_quantity'] > 0:
                                
                                purchased_quantity = random.randint(1, tickets_data[ticket_id]['current_quantity'])
                                purchase_tickets.append({
                                    "type": type,
                                    "quantity": purchased_quantity
                                })
                                
                                # Update tickets and event quantities
                                tickets_data[ticket_id]['current_quantity'] -= purchased_quantity
                                event_data[event]['current_quantity'] -= purchased_quantity

                    # If we have at least one purchased ticket, insert record
                    if len(purchase_tickets):
                        event_purchases.append({
                            "date": fake.future_datetime(end_date='+30d').strftime("%d-%m-%Y %H:%M"),
                            "tickets": purchase_tickets
                        })

            # If we have at least one purchase for the current event, insert record
            if len(event_purchases):
                purchases[f"purchase:{user_id}:{event_id}"] = event_purchases

    return purchases

def generate_notifications(user_data, event_data):
    notifications = {}
    for user in user_data:
        user_id = user.split(':')[1]
        for event, info in event_data.items():
            n_tickets = info['current_quantity']
            if random.random() < NOTIFICATION_PROBABILITY and n_tickets > 0:
                event_id = event.split(':')[1]
                notifications[f'notification:{user_id}:{event_id}'] = max(random.randint(n_tickets - 10, n_tickets + 10), 1)

    return notifications

def main():

    if len(sys.argv) != 2:
        print("Usage: python generate.py <OUTPUT>")
        sys.exit(1)

    user_data = generate_user_data()
    event_data = generate_event_data()
    text_search = generate_text_search(event_data)
    type_search = generate_type_search(event_data)
    location_search = generate_location_search(event_data)
    favourites_data = generate_favourites(user_data, event_data)
    tickets_data = generate_tickets(event_data)
    purchase_data = generate_purchases(user_data, event_data, tickets_data)
    notifications_data = generate_notifications(user_data, event_data)

    data = { 
        **user_data, 
        **event_data, 
        **text_search, 
        **type_search,
        **location_search,
        **favourites_data,
        **tickets_data,
        **purchase_data,
        **notifications_data,
    }

    with open(sys.argv[1], "w") as file:
        json.dump(data, file, indent=2)
        file.close()

if __name__ == "__main__":
    main()
