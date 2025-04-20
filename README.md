# ZP-VGA
Repozitář pro programovou část bakalářské práce na téma Vizualizace grafových algoritmů.


Pokyny pro spuštění jsou následující:
 1. Pro spuštění na lokálním stroji se ujistěte, že na něm běží server.
 2. Spusťte soubor "index.html" na serveru.


Tato práce poskytuje interaktivní prostředí prostředí, ve kterém si uživatel může uživatel intuitivně vytvořit vlastní graf a následně na něm spustit jeden z algoritmů, mezi které patří Depth-First-Search, Breadth-First-Search, Dijsktrův algoritmus, Tarjanův algoritmus pro nalezení silně souvislých komponent a Tarjanův algoritmus pro hledání 2-souvislých komponent.

Po spuštění aplikace vyberte z nabídky algoritmus.
Objeví se před vámi plocha, ve které můžete vytvářet váš graf.

Graf je možné upravovat pomocí lišty nástrojů.
![image](https://github.com/user-attachments/assets/b3a8b8e9-9491-4c6b-a3b4-03991ceff159)

Začněte přidáním hran. 

![image](https://github.com/user-attachments/assets/0c0df49b-8ef2-4689-85da-b47678775a1e)

Stisknutím možnosti tuto možnost vyberete a následným kliknutím myši do prostoru plátna do něj vrchol přidáte.

Jakmile máte v grafu alespoň dva vrcholy, pak mezi nimi můžete přidávat hrany. 

Vyberte možnost přídání hrany.

![image](https://github.com/user-attachments/assets/ce4a1f05-7914-482f-a585-0f71932b9837)

Následně klikněte myší do vrcholu, ze kterého má hrana začínat a poté do druhého vrcholu, kde má hrana končit.

Vybráním možnosti odstranění vrcholu je možné kliknutím do libovolného vrcholu jej odebrat.
Odebrání hrany funguje stejně jako její přidání. U orientovaného grafu je nutné dávat pozor pořadí vybrání vrcholů.

Tlačítky na pravé straně lišty poté můžete přepínat mezi orientovaným a neorientovaným grafem a také zda mají být zobrazeny váhy hran. Pro některé algoritmy není volba jedné, nebo obou možností dostupná.

Pro návrat do nabídky algoritmů slouží tlačítko na levé straně horní lišty.

![image](https://github.com/user-attachments/assets/c7d19721-4103-4585-a1c6-a52a72550f2a)

Jestliže chcete vámi vytvořený graf uložit do souboru, můžete tak učinit stisknutím tlačítka pro uložení v horní liště.

![image](https://github.com/user-attachments/assets/0373ad71-e16d-4808-a63c-8a2f1a529b17)

Pro následné načtení slouží vedlejší tlačítko.

Jestliže nechcete vytvářet vlastní graf, pak nabízí řešení několik ukázkových grafů, které jsou k nalezení v adresáři "examples". Na výběr jsou poté orientované (directed) i neorientované (undirected) grafy ve svých respektivních adresářích.

Jakmile máte graf na kterém byste chtěli vyzkoušet vybraný algoritmus, před tím, než jej spustíte, tak můžete dvojkliknutím na libovolný vrchol tento vrchol nastavit jako počáteční vrchol, od kterého bude algoritmus začínat. Vybraný vrchol se zbarví do červena. Pokuď nevyberete žádny vrchol, tak bude automaticky jako startovní vrchol nastaven ten, který byl přidán do grafu jako první.

Procházení můžete spustit stisknutím tlačítka pro spuštění v nabídce pod grafem.

![image](https://github.com/user-attachments/assets/3ba0fd40-f7ea-43e5-8ac5-e03b84ca0268)

Tato nabídka Vám rovněž nabízí možnost krokovat průběhem algoritmu.

Levým tlačítkem se vrátíte zpět na první krok, napravo od něj se nachází tlačítko pro spuštění automatického krokování a za ním slider, pomocí kterého můžete nastavit jeho rychlost. Stejné tlačítko použijete také pro zastavení automatického krokování. Následuje tlačítko pro krok zpět, spuštění / zastavení procházení a poté tlačítko pro krok kupředu.

Při návratu do nabídky algoritmů se automatické krokování samo zastaví.

Během průchodu grafem není možné graf upravovat. Je však možné načíst graf ze souboru. V takovém případě procházení zastaví a graf se načte.

Po spuštění si nejspíše povšimnete, že se objeví kromě grafu další prvky. Jedním je další graf, který zobrazí Váš graf ve formě stromu a napravo od grafu se objeví tabulka, do které jsou poznačeny informace o stavu grafu a jeho prvcích v daném kroku.

Průběh algoritmu v daném kroku je také znázorněn pomocí zbarvení vrcholů a hran. Kromě toho jsou informace o vrcholech specifické pro daný algoritmus vypisovány také v prvním kvadrantu vrcholu.
