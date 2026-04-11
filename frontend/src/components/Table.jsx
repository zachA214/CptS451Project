import { useState,useEffect } from "react";

export default function Table({dictList}){

    function retrieveKeys(dictList){
        if (!dictList || dictList.length === 0) {
            return [];
        }
        return Object.keys(dictList[0]);
    }
    
    return(
        <table className="table-fixed w-6/7 bg-white border border-gray-300 my-4">
            <thead className="bg-gray-500 text-white">
                <tr>
                    {retrieveKeys(dictList).map(head=> (
                        <th className="border border-gray-300 px-4 py-2" key={head}>{head.toUpperCase()}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {dictList.map(row => (
                    <tr key={row.id}>
                        {retrieveKeys(dictList).map(col =>(
                            <td className="border border-gray-300 px-4 py-2 truncate" key={col}>{row[col]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>

    );

}