import os
import json

def createDirOrga(divisiones,path):
    
    for d in divisiones:
        sigla = d["sigla"].lower()
        dir = str(path) + "/" + sigla;
        os.mkdir(dir)

def createDirDocs(divisiones,path):
    
    for d in divisiones:
        os.chdir(path)
        os.chdir(d["sigla"].lower())
        pathDoc = path + "/" + d["sigla"].lower()
        secciones = d["secciones"]
        for s in secciones:
            cod = s["cod"]
            ini = s["ini"]
            fin = s["fin"]
            for i in range(ini,fin):
                dirName = cod + str(i);
                os.mkdir(pathDoc + "/" +dirName)


def openJsonInitial(pathRoot):
    with open("data.json") as f:
      allData = json.load(f);  
      orgas = allData["orgas"]
      for o in orgas:
        try:
            divisiones = o["divisiones"]
        except KeyError:
            sigla = o["sigla"].lower()
            os.mkdir(sigla)
        else:
            os.chdir(pathRoot + "/" + "docs")
            path = pathRoot + "/" + "docs"
            createDirOrga(divisiones,path)
            createDirDocs(divisiones,path)
        
def main():
    pathRoot = os.getcwd()
    openJsonInitial(pathRoot)
    
main()