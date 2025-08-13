from random import*

def demande(joueur):
    val=int(input(f"{joueur}, entrez un entier (1,2,3): ")
            
    while not (1<=val<=3):
            val=int(input(f"Faux ! {joueur}, entrez un entier (1,2,3): ")

    return val

def tour(joueur_actuelle):
    compteur=0
    while(compteur <20):
        val=demande(joueur_actuelle)
        compteur+=val
        
        if compteur >= 20:
            print(f"Le joueur {joueur_actuelle} a perdu ce tour")
            if joueur_actuelle=='A':
                return 'B'
            else:
                return 'A'
        joueur_actuelle= 'B' if joueur_actuelle='A' else 'A'
            





def jeu():
    scores={'A':0,'B':0}
    dernier_joueur=None

    while abs(scores['A']-scores['B'])<2 :
        if (derniers_joueur=='A'):
            joueur='A'
        elif (dernier_joueur=='B'):
            joueur='B'
        else:
            joueur=random.choice(['A','B'])

        gagnant=tour(joueur)
        scores[gagnant]+=1
        dernier_joueur=gagnant

    if scores['A'] > scores['B'] :
        print(f"Le gagnant est {A}")
    else:
        print(f"Le gagnant est {B}")

    
