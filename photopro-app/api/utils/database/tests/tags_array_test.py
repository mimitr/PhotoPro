array = "ARRAY["
for i in set(['elephant', 'african', 'cute', 'animal', 'elephant', 'african', 'cute', 'animal']):
    array = array + "\'" + i + "\',"
array = array[:len(array)-1] + "]"
print(array)