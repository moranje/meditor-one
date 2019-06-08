# Placeholder

## SIMPELE PLACEHOLDER

Text is een fijn hulpmiddel maar om je effiecient door een document te verplaatsen bestaan er placeholders. Met de simpele variant kun je makkelijk tussen naar de relevante text springen.

::: snippet Verplaatsen in text
Patient heeft last van $1, bestaat sinds $2 en duurt dan $3.
:::

Je kunt ook teglijkertijd op meer plekken informatie invullen.

::: snippet Meerdere cursors
Pijn aan voet $1 (links/rechts). Geen drukpijn over 1e tot 5e straal $1.
:::

![placeholder-simple](/img/docs/placeholder-simple.gif)

### PS

Het gebruik van haken rond het getal is toegestaan `${1}` en is functioneel gelijk aan `$1`

## PLACEHOLDER MET NAAM

Soms wil je stukje text op meerde plaatsen in je text terug laten komen, zonder dat je je ze apart wil aanpassen. Hiervoor zijn aan een placeholder gekoppelde variablen beschikbaar. De naa van de variable die je wil laten terugkomen staat in accolades `<>` achter de placeholder.

::: snippet Placeholder met naam
Reden van komst
Trauma $1<extremiteit>

Lichamelijk onderzoek
$extremiteit: geen drukpijn ...
:::

## PLACEHOLDER MET WAARDE

::: snippet Placeholder met waarde
Placeholders kunnen een ${1:waarde} hebben. Deze waarde wordt direct in de text ingevuld.
:::

## PLACEHOLDER MET WAARDE EN NAAM

Ook placeholders met een waarde kunnen een naam hebben. Ze werken hetzelfde als simpele placeholders met naam.

::: snippet Placeholder met waarde en naam
Deze placeholder heeft een naam ${1<voorbeeld>:en dat is voorbeeld-3} die ervoor zorg dat een variabele met dezelfde naam tegelijkertijd mee veranderd $voorbeeld
:::

## NESTING

Placeholders met waarde kunnen verschillende soorten waarden hebben. Hieronder staat een lijstje met typen waarden die placeholders kunnen hebben. Deze kunnen ook gemengd gebruikt worden.

::: snippet Placeholder nesting
${1:Normale text.}
${2:Text met simpele placeholder $3}
${4:Text met placholder $5<voorbeeld> met naam $voorbeeld}
${6:Text met placholder met ${7:waarde (en zo maar door)}}
${8:Text met placholder ${9<voorbeeld-2>:met waarde en} met naam $voorbeeld-2}
${10:Een keuze: ${11|Een,Twee,Drie|}}
${12:Een keuze: ${!13:voorbeeld-expansion}}
:::

EN NOG VEEL MEER...
