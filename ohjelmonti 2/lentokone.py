import json

from flask import Flask, Response
from flask_cors import CORS
import mysql.connector
import uuid


yhteys = mysql.connector.connect(
    host='127.0.0.1',
    port=3306,
    database='lentokone',
    user='root',
    password='Nihad1996#',
    autocommit=True
)

app= Flask(__name__)
cors = CORS(app)
app.config['COR_HEADERS'] = 'Content-Type'

@app.route('/airport')
def airport():
    sql = f"SELECT iso_country FROM country WHERE iso_country IN ('FI', 'SE', 'IT', 'AT', 'FR', 'PL', 'DK', 'NO', 'GR', 'NL', 'ES', 'CZ', 'CH', 'DE', 'BE', 'TR', 'IS', 'GB', 'UA', 'MK');"
    cursor = yhteys.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    paluujson = json.dumps(result)
    tilakoodi = 200
    return Response(response=paluujson, status=tilakoodi, mimetype="application/json")

@app.route('/country/<iso_country>')
def country(iso_country):
    sql = "SELECT name FROM country WHERE iso_country = '" + iso_country + "'";
    cursor = yhteys.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    paluujson = json.dumps(result)
    tilakoodi = 200
    return Response(response=paluujson, status=tilakoodi, mimetype="application/json")

@app.route('/question/<iso_country>')
def questions(iso_country):
    sql = "SELECT question FROM questions WHERE iso_country = '" + iso_country + "'";
    cursor = yhteys.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    paluujson = json.dumps(result)
    tilakoodi = 200
    return Response(response=paluujson, status=tilakoodi, mimetype="application/json")
@app.route('/choices/<iso_country>')
def choices(iso_country):
    sql = "SELECT option_1,  option_2, option_3, option_4 FROM answer WHERE iso_country = '" + iso_country + "'";
    cursor = yhteys.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    paluujson = json.dumps(result)
    tilakoodi = 200
    return Response(response=paluujson, status=tilakoodi, mimetype="application/json")
@app.route('/True_choice/<iso_country>')
def True_choice(iso_country):
    sql = "SELECT correct FROM answer WHERE iso_country = '" + iso_country + "'";
    cursor = yhteys.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    paluujson = json.dumps(result)
    tilakoodi = 200
    return Response(response=paluujson, status=tilakoodi, mimetype="application/json")
@app.route('/createaccount/<name>')
def login(name):
    random_id = str(uuid.uuid4())
    sql = 'insert into game( id, co2_consumed, co2_budget, screen_name, location, iso_country) VALUES (%s, %s, %s, %s, %s, %s)'
    cursor = yhteys.cursor()
    cursor.execute(sql, (random_id, 0, 300, name, 'EFHK', 'FI'))
    yhteys.commit()
    cursor.close()
    return "User registered successfully!"

@app.route('/login_names/<name>')
def get_names(name):
    sql = "SELECT screen_name from game where screen_name = '" + name + "'";
    cursor = yhteys.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    paluujson = json.dumps(result)
    tilakoodi = 200
    return Response(response=paluujson, status=tilakoodi, mimetype="application/json")

@app.route('/get_location/<names>')
def get_location(names):
    sql = "SELECT location from game where screen_name = '" + names + "'"
    cursor = yhteys.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    paluujson = json.dumps(result)
    tilakoodi = 200
    return Response(response=paluujson, status=tilakoodi, mimetype="application/json")

@app.route('/get_location_cordinates/<names>')
def get_location_cordinates(names):
    sql = f"select airport.longitude_deg, airport.latitude_deg, game.location from airport,game where game.location = airport.ident and game.screen_name='{names}'"
    cursor = yhteys.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    paluujson = json.dumps(result)
    tilakoodi = 200
    return Response(response=paluujson, status=tilakoodi, mimetype="application/json")
@app.route('/get_consumed/<names>')
def get_consumed(names):
    sql = "SELECT co2_consumed from game where screen_name = '" + names + "'"
    cursor = yhteys.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    paluujson = json.dumps(result)
    tilakoodi = 200
    return Response(response=paluujson, status=tilakoodi, mimetype="application/json")
@app.route('/get_budget/<names>')
def get_budget(names):
    sql = "SELECT co2_budget from game where screen_name = '" + names + "'"
    cursor = yhteys.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    paluujson = json.dumps(result)
    tilakoodi = 200
    return Response(response=paluujson, status=tilakoodi, mimetype="application/json")
@app.route('/get_iso_country/<names>')
def get_iso_country(names):
    sql = "select iso_country from game where screen_name = '" + names + "'"
    cursor = yhteys.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    paluujson = json.dumps(result)
    tilakoodi = 200
    return Response(response=paluujson, status=tilakoodi, mimetype="application/json")

@app.route('/countryinfo/<iso_country>')
def countryinfo(iso_country):
    sql = "SELECT name, latitude, longitude FROM country WHERE iso_country = %s;"
    cursor = yhteys.cursor()
    cursor.execute(sql, (iso_country,))
    result = cursor.fetchall()
    countries = [{'name': row[0], 'latitude': row[1], 'longitude': row[2]} for row in result]
    paluujson = json.dumps(countries)
    return Response(response=paluujson, status=200, mimetype="application/json")


from flask import request


@app.route('/update_add_money_budget/<player_name>', methods=['POST'])
def update_add_money_budget(player_name):
    try:


        sql = f"UPDATE game SET co2_budget = co2_budget + 50 WHERE screen_name = '{player_name}'"
        cursor = yhteys.cursor()
        cursor.execute(sql)
        yhteys.commit()

        print("Update successful")
        cursor.close()
        return Response(response=json.dumps({"message": "Budget updated successfully"}), status=200, mimetype="application/json")
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return Response(response=json.dumps({"message": "An error occurred"}), status=500, mimetype="application/json")
@app.route('/update_budget_väärinkysymys/<player_name>', methods=['POST'])
def update_budget_väärinkysymys(player_name):
    try:


        sql = f"UPDATE game SET co2_budget = co2_budget - 10 WHERE screen_name = '{player_name}'"
        cursor = yhteys.cursor()
        cursor.execute(sql)
        yhteys.commit()

        print("Update successful")
        cursor.close()
        return Response(response=json.dumps({"message": "Budget updated successfully"}), status=200, mimetype="application/json")
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return Response(response=json.dumps({"message": "An error occurred"}), status=500, mimetype="application/json")

@app.route('/update_budget_liikuminen/<player_name>', methods=['POST'])
def update_budget_liikuminen(player_name):
    try:


        sql = f"UPDATE game SET co2_budget = co2_budget - 20 WHERE screen_name = '{player_name}'"
        cursor = yhteys.cursor()
        cursor.execute(sql)
        yhteys.commit()

        print("Update successful")
        cursor.close()
        return Response(response=json.dumps({"message": "Budget updated successfully"}), status=200, mimetype="application/json")
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return Response(response=json.dumps({"message": "An error occurred"}), status=500, mimetype="application/json")



if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)