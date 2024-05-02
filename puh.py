import pywhatkit

try:
    pywhatkit.sendwhatmsg("+358458006887", "Hello_python", 19, 2)
    print("successfully")

except:
    print("Error")