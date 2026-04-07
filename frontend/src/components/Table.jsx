import { useState,useEffect } from "react";

export default function Table({dictList}){
    

    return(
        <table className="table-auto w-3/4 bg-white border border-gray-300 my-4">
            <thead className="bg-gray-500 text-white">
                <tr>
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                </tr>
            </thead>
            <tbody>
                {dictList?.map((item) => (
                <tr key={item.id}>
                    <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                </tr>
                ))}
            </tbody>
        </table>

    );

}