// Constante de l'URL de l'API
const URL = "https://opendata.paris.fr/api/records/1.0/search/?dataset=sanisettesparis&q=&rows=300&facet=type&facet=statut&facet=arrondissement&facet=horaire&facet=acces_pmr&facet=relais_bebe";


// ***** AXIOS *****
axios //On utilise axios pour récupérer les données
    .get(URL) // localisée à cette URL
    .then((res) => demarrer(res)) // Si la requête est un succès on peut démarrer la prochaine fonction
    .catch((err) => console.error(err)) // Sinon on log une erreur dans la console



function demarrer(res) {
    const tous = res.data.records; 
    display(tous); // on affiche le tableau
    document.getElementById("input").oninput = function (evt) { // On écoute les évènements à la saisie de l'input texte
        const filterToilettes = monFiltre(tous, evt.target.value); // On utilise le filtre par adresse
        display(filterToilettes); // On affiche le résultat par adresse
    }
    document.getElementById("input2").oninput = function (evt) {
        const filterToilettes2 = monFiltre2(tous, evt.target.value); // On utilise le filtre par arrondissement
        display(filterToilettes2); // On affiche le résultat par arrondissement
    }
}

// ***** AFFICHAGE *****
function display(toilettes) { // Fonction pour afficher notre liste de données dans la page Html
    const list = document.getElementById("liste"); // Constante pour appeler notre ul par son ID
    list.innerHTML = ""; // On remet à zéro la liste
    // Avec le forEach on parcourt chaque index de notre tableau puis on manipule l'Html afin de pouvoir y insérer nos li contenant l'adresse et l'arrondissement de chaque toilette
    toilettes.forEach((toilette) => (list.innerHTML += ` <li class="lignes"> 
    ${toilette.fields.adresse}
    <p>Arrondissement : ${toilette.fields.arrondissement}</p>
    <button class="btn" data-statut="${toilette.fields.statut}" data-pmr="${toilette.fields.acces_pmr}" data-horaire="${toilette.fields.horaire}" data-type="${toilette.fields.type}">Plus d'infos</button>
    </li>`));

    const btns = list.querySelectorAll(".btn"); // On récupere  les boutons qui affichent des infos supplémentaires
    btns.forEach((btn) => (btn.onclick = displayMore)); // On boucle sur eux et on leur attribut un onclick qui affichera la div qui contient plus d'infos
}


// ***** FILTRES *****
function monFiltre(toilettes, search) { //Fonction de filtre avec comme attribut le tableau et la recherche
    return toilettes.filter(function (toilette) { // On retourne le résultat de notre nouveau tableau filtré afin de pouvoir exécuter la fonction de comparaison
        return toilette.fields.adresse.toLowerCase().match(search.toLowerCase()); // On retourne, en minuscule, la comparaison du résultat de l'input pour l'adresse s'il correspond à un résultat de notre liste de données
    });
}

function monFiltre2(toilettes, search) { //Fonction de filtre avec comme attribut le tableau et la recherche
    return toilettes.filter(function (toilette) { // On retourne le résultat de notre nouveau tableau filtré afin de pouvoir exécuter la fonction de comparaison
        return toilette.fields.arrondissement.match(search); // On retourne, en minuscule, la comparaison du résultat de l'input pour l'arrondissement s'il correspond à un résultat de notre liste de données
    });
}



// Afficher les infos supplémentaires
function displayMore(evt) {
    const details = document.getElementById("details"); // On récupere la div qui contiendra les infos supplémentaires
    details.classList.remove("is-hidden"); // On lui enleve sa classe is-hidden pour la rendre visible
    const statut = evt.target.getAttribute("data-statut"); // On récupere l'attribut personnalisé du statut des toilettes du bouton sur lequel on a cliqué
    const pmr = evt.target.getAttribute("data-pmr"); // De même pour l'attribut personnalisé concernant l'acces pmr
    const horaire = evt.target.getAttribute("data-horaire"); // De même pour l'attribut personnalisé concernant l'horaire
    const type = evt.target.getAttribute("data-type"); // De même pour l'attribut personnalisé concernant le type
    details.innerHTML += ` 
    <button id="close">Fermer</button>
    <h2>Statut : <span id ="statut">${statut}</span></h2>
    <p>Horaire : ${horaire}</p>
    <p>Accès PMR : ${pmr}<p>
    <p>Type de sanitaires : ${type}</p>
    ` // Manipulation de l'HTML pour afficher toutes ces infos dans la div qui est maintenant visible

    const btnClose = document.getElementById("close") // On recupere les boutons qu'on a mis dans la div
    btnClose.addEventListener("click", function() { // On les écoute
        details.innerHTML = ""; // Lorsqu'on clique sur le bouton Fermer, la div se vide de tous ses éléments
        details.classList.add("is-hidden"); // Et puis la div redevient invisible
    })

    const openClose = document.getElementById("statut");
    openClose.textContent === "Ouvert" ? openClose.style.color = "green" : openClose.style.color = "red";  // Condition ternaire pour afficher Ouvert en "vert" et "Fermé" en rouge

}
