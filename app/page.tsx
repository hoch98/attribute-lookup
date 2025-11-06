"use client"
import { Text } from "@/components/retroui/Text";
import {
    Table,
} from "@/components/retroui/Table"
import attributeData from './data.json' 
import "./page.css"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { Select } from "@/components/retroui/Select";

function formatNumberCompact(number:number) {
  if (typeof number !== 'number') {
    return number; // Return as is if not a number
  }

  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  });

  return formatter.format(number);
}

const shardRequired:{[key:string]: number} = {
  "Common":96,
  "Uncommon": 64,
  "Rare": 48,
  "Epic": 32,
  "Legendary": 24
}

const sortFuncs:{[key:string]: Function} = {
  "usefulness": (a:any, b:any) => parseInt(b.Usefulness[0])-parseInt(a.Usefulness[0]),
  "rarity": (a:any, b:any) => shardRequired[a.Rarity]-shardRequired[b.Rarity]
}

export default function Home() {

  const [selected, setSelected] = React.useState<{
    "Name": string,
    "Rarity": string,
    "Usefulness": string,
    "Shard": string,
    "Level 1": string,
    "Level 10": string
  } | null>(null);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<any[]>([]);
  const [shardPrices, setShardPrices] = React.useState<any>({});
  const [sortType, setSortType] = React.useState("usefulness");
  const [sortAsc, setSortAsc] = React.useState(false);

  React.useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.hypixel.net/v2/skyblock/bazaar');
    xhr.onload = function() {
      if (xhr.status === 200) {
        var shards:{[key:string]:any} = Object.fromEntries(
          Object.entries(JSON.parse(xhr.responseText)["products"]).filter(([key, value]) => key.includes('SHARD_'))
        );
        var shard_data:{[key:string]:number} = {};
        Object.keys(shards).forEach((itemName) => {
          if (shards[itemName]["sell_summary"][0] == undefined) {
            shard_data[itemName.replaceAll("SHARD_", "").replaceAll("_", "")] = 9999999999
          } else {
            shard_data[itemName.replaceAll("SHARD_", "").replaceAll("_", "")] = parseInt(shards[itemName]["sell_summary"][0]["pricePerUnit"])
          }
        })
        console.log(shard_data)
        setShardPrices(shard_data)
      }
    };
    xhr.send();
  }, [])

  function sortData() {
    var sortedData = [...attributeData].sort((sortFuncs[sortType] as any));
    console.log(sortedData)
    if (sortAsc) sortedData.reverse()
    setData(sortedData);
  }

  React.useEffect(() => {
    sortData()
  }, [sortType, sortAsc]);

  function handleOpen(attribute: any) {
    setSelected(attribute);
    setOpen(true);
  }

  return (
    <div className="body">
      <Text as={"h2"} className="mb-6">
        Attribute Lookup
      </Text>
      <Text className="mb-1">
        Sort By
      </Text>
      <Select onValueChange={(value) => {
        setSortType(value);
      }}>
        <Select.Trigger className="w-60">
          <Select.Value placeholder="Usefulness" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Item value="usefulness">Usefulness</Select.Item>
            <Select.Item value="rarity">Rarity</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select>

      <Text className="mb-1 mt-6">
        Sort Order
      </Text>
      <Select onValueChange={(value) => {
        setSortAsc(value == "true" ? true : false);
      }}>
        <Select.Trigger className="w-60">
          <Select.Value placeholder="Descending" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Item value="true">Ascending</Select.Item>
            <Select.Item value="false">Descending</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select>
      <Table className="mb-6 mt-12 mx-auto">
        <Table.Header>
            <Table.Row>
              <Table.Head className="w-[200px]">Name</Table.Head>
              <Table.Head className="text-center">Rarity</Table.Head>
              <Table.Head className="text-center">Usefulness</Table.Head>
              <Table.Head className="text-center">Shard</Table.Head>
              <Table.Head className="text-center">LVL 10</Table.Head>
              <Table.Head className="text-center">Price To Max</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((attribute:any) => (
              <Table.Row style={{fontSize: "125%"}} key={attribute.Name} onClick={() => handleOpen(attribute)}>
                <Table.Cell className="font-medium">{attribute.Name}</Table.Cell>
                <Table.Cell className="text-center">{attribute.Rarity}</Table.Cell>
                <Table.Cell className="text-center">{attribute.Usefulness}</Table.Cell>
                <Table.Cell className="text-center">{attribute.Shard}</Table.Cell>
                <Table.Cell className="text-center">{attribute["Level 10"]}</Table.Cell>
                <Table.Cell className="text-center">{formatNumberCompact(((shardPrices[attribute.Shard.toUpperCase().replaceAll(" ", "")]) as number) * shardRequired[attribute.Rarity])}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            {selected ? (
              <>
                <DialogHeader>
                  <DialogTitle>{selected.Name}</DialogTitle>
                  <DialogDescription>
                    <div className="mt-3 space-y-2 text-sm">
                      <p><strong>Rarity:</strong> {selected.Rarity}</p>
                      <p><strong>Usefulness:</strong> {selected.Usefulness}</p>
                      <p><strong>Shard:</strong> {selected.Shard}</p>
                      <p><strong>Level 1:</strong> {selected["Level 1"]}</p>
                      <p><strong>Level 10:</strong> {selected["Level 10"]}</p>
                      <p><strong>Shards Required:</strong> {shardRequired[selected.Rarity]}</p>
                      <p><strong>Price Per Shard (Insta-Buy):</strong> {formatNumberCompact(shardPrices[selected.Shard.toUpperCase().replaceAll(" ", "")])}</p>
                      <p><strong>Price To Max:</strong> {formatNumberCompact(((shardPrices[selected.Shard.toUpperCase().replaceAll(" ", "")]) as number) * shardRequired[selected.Rarity])}</p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </>
            ) : (
              <p>No attribute selected</p>
            )}
          </DialogContent>
        </Dialog>
    </div>
  );
}
