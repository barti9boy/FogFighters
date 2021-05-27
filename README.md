# FogFighters
Repozytorium z projektem zaliczeniowym na JPiA - gra Fog Fighters

Credits:
Bartosz Jaromin, 
Marcel Cisowski, 
Katarzyna Firek, 
Natalia Dudek, 
Aleksandra Mrowca, 
Julia Kącka

Description of the game:
Fog Fighters is a online 2-player game, which requires strategy and analitical thinking. Concept of the game is based of the game of battleships. Both players have 4 by 4 boards, on which they arrange their units. These units are: Warrior, Rogue and Archer (each described below). Players do not see each other's boards. After both players located their units on the boards, they each take turns in which they try to hit and eliminate oponent's units. To do so, they must first choose a unit to attack with, and then choose suitable squares on oponent's board. Each unit has unique pattern of attack, and damage they deal to hostile units. Player is informed about successful hits, however he will not be informed which unit or units he attacked or how much damage he delt. Unit that was hit will loose health points equal to the number of damage points attacker delt to that square. When unit's life will be lower or equal to 0, the unit is eliminated and the player is informed that a lethal strike is delivered. After a unit is eliminated from the game, it can no longer be used to attack oponent's board. The first player to eliminate all of oponent's units wins.

Unit description:

-----Warrior------

-Can be located in the first row of your board 

-Health points: 40

-Attack pattern: attacks two adjacent squares, deals 8 damage points to each (might be patched later)


-----Rogue------

-Can be located in the second or third row of your board

-Health points: 10

-Attack pattern: attacks two oblique squares, deals 20 damage points to each

-----Archer------

-Can be located in the fourth row of your board

-Health points: 24

-Attack pattern: shoots an arrow into a selected column, and deals 12 damage only to the first unit it hits. If there is more than one enemy unit in the column, the priority of the hit will be Warrior-Rogue-Archer (hight to low).
