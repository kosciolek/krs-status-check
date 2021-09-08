import { Box, Container, TextField } from "@material-ui/core";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useQueries, useQuery } from "react-query";
import styles from "../styles/Home.module.css";

const fetchStatus = async (krsNum: string) =>
  fetch(`/api/krs-status?id=${krsNum}`).then((resp) => resp.json());

export default function Home() {
  const [textfield, setTextfield] = useState("");
  const [ids, setIds] = useState([] as string[]);

  useEffect(() => {
    const listener = (e: DragEvent) => {
      e.preventDefault();
      if (!e.dataTransfer) return;
      if (e.dataTransfer.files.length !== 1)
        alert("You must drop exactly 1 file.");

      const file = e.dataTransfer.files[0];
      const reader = new FileReader();

      reader.onload = (ev) => {
        const txt = ev.target.result as string;
        const lines = txt
          .trim()
          .split(/\r?\n/)
          .map((line) => line.trim());
        for (const [index, line] of Object.entries(lines)) {
          if (!/^\d{10}$/.test(line))
            return alert(
              `Line no. ${index + 1} is incorrect. Must be 10-digit strings.`
            );
        }

        window.focus();
        setIds(lines);
        setTextfield("");
      };

      reader.readAsText(file);
    };

    window.ondragenter = (e) => e.preventDefault();
    window.ondragover = (e) => e.preventDefault();

    window.addEventListener("drop", listener);
    return () => window.removeEventListener("drop", listener);
  }, []);

  const q = useQueries(
    /^\d{10}$/.test(textfield)
      ? [
          {
            queryKey: ["krs-status", textfield],
            queryFn: async () => await fetchStatus(textfield),
            refetchOnWindowFocus: false,
          },
        ]
      : ids.map((id) => ({
          queryKey: ["krs-status", id],
          queryFn: async () => await fetchStatus(id),
          refetchOnWindowFocus: false,
        }))
  );

  return (
    <Container style={{ marginTop: "64px" }}>
      <Box display="flex" justifyContent="center">
        <TextField
          value={textfield}
          onChange={(e) => setTextfield(e.target.value)}
          label="KRS"
        />
      </Box>
      {q.map((subq, i) => (
        <div key={i}>{JSON.stringify(subq.data)}</div>
      ))}
    </Container>
  );
}
