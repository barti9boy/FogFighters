<?php
if(!session_id()) session_start();

$dbhost 	= "localhost"; //kiedy baza będzie na serwerze trzeba zmienić scieżkę
$dbname		= "fogfighters";
$dbuser		= "root";
$dbpass		= "";


$link = mysqli_connect($dbhost,$dbuser,$dbpass,$dbname); //połączenie z bazą danych
if(!$link){
    printf("Connect failed: %s\n",mysqli_connect_error());
    exit(); 
    //obsługa błędu połączenia z bazą danych
}

/*
    w plikach w których będzie trzeba kożystać ze zmiennych przechowywanych w bazie danych,
    zamiast pisania $link = mysqli_connect... będzie można w pliku dopisać na początku:
    include_once("../connectToDB.php");
    (dwie kropeczki oznaczają cofnięcie się do poprzedniego folderu więc jeśli w php_pages ktoś zrobi kolejny folder to będzie musiał dopisać ../../connectToDB)
    dzięki temu jeśli zmieni się serwer na którym będzie baza danych, zmienne wystarczy zmienić raz, i nie trzeba będzie szukać po plikach gdzie był z palca wpisywany localhost
*/