import os, uuid, re
import json,glob

def countDirs(cod,dirPath):   
    os.chdir(dirPath)
    print("Seccion " + cod)
    files = glob.glob(cod + '*')
    print(len(files))
    max =0;
    min = 10000;
    areturn =[0,0]
    for f in files:
        try:
            if os.path.isdir(os.path.join(dirPath,f)):
                
                m = re.match(r"([a-zA-Z]+)([0-9]+)",f)
                
                number = int(m.group(2))
                if(number < min):
                    min = number
                if(number > max):
                    max = number
        except OSError as err:
            print("OS error: {0}".format(err))
            print("No hay directorios con numeros - " + dirPath )
            
        except ValueError:
            print("Could not convert data to an integer.")
            print("No hay directorios con numeros - " + dirPath )
            
        except AttributeError :
            print("Error de atributo.")
            print("No hay directorios con numeros - " + dirPath )
            #print(m.group(1))
        except BaseException as err:
            print("Unexpected ")
            print("No hay directorios con numeros - " + dirPath )
            
    areturn[0] = min
    areturn[1] = max
    return areturn


def leerDirDocs(o,path):   
    divisiones = o["divisiones"]
    for d in o["divisiones"]:
        os.chdir(path)
        os.chdir(d["sigla"].lower())
        pathDoc = path + "/" + d["sigla"].lower()
        secciones = d["secciones"]
        for s in secciones:
            cod = s["cod"]
            dirPath = pathDoc
            indices = countDirs(s["cod"],dirPath)
            s["ini"] = indices[0]
            s["fin"] = indices[1]
    return o

def changesInJason(allData, pathRoot):
    orgas = allData["orgas"]
    for o in orgas:
        
        try:
            divisiones = o["divisiones"]
        except KeyError:
            print("no hay divisiones")
            print(o["sigla"])

        else:
            os.chdir(pathRoot )
            path = pathRoot
            o = leerDirDocs(o,path)
    return allData

def updateJson(pathRoot):
    filename =pathRoot + "/" + 'data.json'
    allData =""
    with open(filename, 'r') as f:
        allData = json.load(f)
        # add, remove, modify content
        allData = changesInJason(allData, pathRoot)
    
    # create randomly named temporary file to avoid 
    # interference with other thread/asynchronous request
    tempfile =os.path.join(os.path.dirname(filename), str(uuid.uuid4())) +".json"
    print(tempfile)
    with open(tempfile, 'w') as f:
        json.dump(allData, f, indent=4)

    # rename temporary file replacing old file
    os.rename(tempfile, filename)

    

def main():
    pathRoot = os.getcwd()
    updateJson(pathRoot)
    
main()