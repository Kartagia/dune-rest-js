import React from "react";
import {useState} from ",react";


export default function SkillComponent({ value: undefined, defaultValue :undefined, onRemove:()=>{}, onChange: ()=>{} }) {
  
  const skill = defaultValue;
  return (
    <>
    {
      return (
      <Text>{skill.name}</Text>
      );
    }
    {
      return (skill.level != null?<Text>{skill.level}</Text>:<Text></Text>)}
      {
        actions.map( (act, i) => {
          return (<span><input type="button" value={act.name} onclick={}></input></span>;
        })
      }
    </>);
}