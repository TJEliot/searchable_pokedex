import React, { Component } from 'react';
import $ from 'jquery';

class PokemonList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pokemonList: ["test"]
        };
        this.typesList = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
    }

    componentDidMount() {
        fetch("https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json")
            .then(response => response.json())
            .then((result) => {
                let pokemonList = result["pokemon"];
                this.setState({
                    pokemonList: pokemonList
                })
            })

            //search for pokemon by name
            $("#search-criteria").on("keyup", function() {
                let searchTerm = $(this).val().toLowerCase();
                $(".pokemonName").each(function() {
                    let thisName = $(this).text().toLowerCase();
                    $(this).closest('.pokemonStatBlock')[thisName.indexOf(searchTerm) !== -1 ? 'show' : 'hide' ]();
                });
            });

            //filter by type(s)
            let typeRestrictions = [];
            $(".selectTypes").change((typeBox) => {
                if (typeRestrictions.includes(typeBox.currentTarget.name)) {
                    typeRestrictions.splice(typeRestrictions.indexOf(typeBox.currentTarget.name), 1);
                } else {
                    typeRestrictions.push(typeBox.currentTarget.name);
                }
                //the below loops through all of the pokemon and checks their types against the whitelist
                $(".pokemonStatBlock").each(function (index) {
                    $(this).closest('.pokemonStatBlock')[displayOrNot(index) ? 'show' : 'hide']();
                })
            });

            //filter by weaknesses
            let weaknessRestrictions = [];
            $(".selectWeakness").change((weaknessBox) => {
                if (weaknessRestrictions.includes(weaknessBox.currentTarget.name)) {
                    weaknessRestrictions.splice(typeRestrictions.indexOf(weaknessBox.currentTarget.name), 1);
                } else {
                    weaknessRestrictions.push(weaknessBox.currentTarget.name);
                }
                $(".pokemonStatBlock").each(function (index) {
                    $(this).closest('.pokemonStatBlock')[displayOrNot(index) ? 'show' : 'hide']();
                })
            });

            let checkTypes = function(thisType, typeRestrictions) {
                let displayMe = true;
                for (let i = 0; i < typeRestrictions.length; i++) {
                    if (thisType.indexOf(typeRestrictions[i]) == -1) {
                        displayMe = false;
                    }
                }
                return displayMe;
            };

            let checkWeaknesses = function(thisType, weaknessRestrictions) {
                let displayMe = true;
                for (let i = 0; i < weaknessRestrictions.length; i++) {
                    if (thisType.indexOf(weaknessRestrictions[i]) == -1) {
                        displayMe = false;
                    }
                }
                return displayMe;
            };

            function displayOrNot(index) {
                    let thisType = $(".pokeType")[index].innerHTML.toLowerCase();
                    let thisWeakness = $(".pokeWeakness")[index].innerHTML.toLowerCase();
                    let displayMe1 = checkTypes(thisType, typeRestrictions);
                    let displayMe2 = checkWeaknesses(thisWeakness, weaknessRestrictions);
                    return displayMe1 && displayMe2;
            }
    }

    render() {
        //this displays the list of pokemon types
        let pokeTypesList = this.typesList.map(function(type) {
            return <span><input type={"checkbox"} className={"selectTypes"} name={type} value={type}></input>
                    <label form={type}>{type}</label>
                   </span>
        });

        //this displays the list of weaknesses
        let weaknessTypesList = this.typesList.map(function(type) {
            return <span><input type={"checkbox"} className={"selectWeakness"} name={type} value={type}></input>
                    <label form={type}>{type}</label>
                   </span>
        });

        //this displays the list of pokemon
        this.formattedPokemonList = this.state.pokemonList.map(function(item, key) {
            //this is for text formatting an individual pokemon's weakness(es), so it's easier to read
            let formattedWeaknesses = item["weaknesses"];
            if (item["weaknesses"] !== undefined) {
                formattedWeaknesses = item["weaknesses"].map(function(weakness, index, listOfWeaknesses) {
                    if (index === listOfWeaknesses.length-1) {
                        return `and ${weakness}`;
                    } else {
                        return `${weakness}, `;
                    }
                });
            }
            //this is for text formatting an individual pokemon's type(s), so it's easier to read
            let formattedTypes = item["type"];
            if (item["type"] !== undefined) {
                if (item["type"].length > 1) {
                    formattedTypes = `${item["type"][0]}/${item["type"][1]}`
                }
            }
            //this displays the info for an individual pokemon
            return (<div className={"pokemonStatBlock"} key = {item["num"]}>
                    <img src={item["img"]}></img>
                    <div className={"pokemonName"}>{item["num"]}: {item["name"]}</div>
                    <div className={"pokeType"}> Type: {formattedTypes} </div>
                    <div className={"pokeWeakness"}>Weaknesses: {formattedWeaknesses} </div>
                    <br/>
                </div>);
        });

        return (
            <div>Types: {pokeTypesList}
            <br/>
            <input type="text" id="search-criteria" placeholder="Search for a Pokémon" />
            <br/>
                Weaknesses: {weaknessTypesList}
                {this.formattedPokemonList}
            </div>
        )
    }
}

export default PokemonList;
