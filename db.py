import mysql.connector
from mysql.connector import Error

# Create connection function
def create_connection():
    """Create and return a database connection."""
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Hamna@08",
            database="smart_resume_analyzer"
        )
        if conn.is_connected():
            print("Connected to MySQL Database")
            return conn
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None


# Function to insert decisions
def insert_resume_decision(filename, score, decision):
    """Insert a decisions (Accept/Waitlist/Reject)."""
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = """
                INSERT INTO decisions (filename, score, decision)
                VALUES (%s, %s, %s)
            """
            cursor.execute(query, (filename, score, decision))
            conn.commit()
            print("Resume decision saved!")
        except Error as e:
            print(f"Error inserting data: {e}")
        finally:
            cursor.close()
            conn.close()


# Function to fetch all decisions
def fetch_resumes():
    """Fetch all resumes and their decisions."""
    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = "SELECT * FROM decisions"
            cursor.execute(query)
            results = cursor.fetchall()
            return results
        except Error as e:
            print(f"Error fetching data: {e}")
            return []
        finally:
            cursor.close()
            conn.close()
