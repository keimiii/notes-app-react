import express from "express";
import env from "dotenv";
import cors from "cors";

import { createClient } from "@supabase/supabase-js";

env.config();

const app = express();

const dbURL: string = process.env.DATABASE_URL || "";
const dbKey: string = process.env.DATABASE_KEY || "";
const supabase = createClient(dbURL, dbKey);

app.use(express.json());
app.use(cors());


app.get("/api/notes", async (req, res) => {
    const { data, error } = await supabase.from("notes").select();
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.send(data);
});

app.post("/api/notes/create", async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        res.status(400).send("title and content fields required");
        return;
    }

    const { error } = await supabase
        .from('notes')
        .insert({
            title: req.body.title,
            content: req.body.content,
        })
    if (error) {
        res.send(error);
        return;
    }
    res.json({
        title: req.body.title,
        content: req.body.content,
    });
});

app.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = parseInt(req.params.id);

    if (!title || !content) {
        res.status(400).send("title and content fields required");
        return;
    }

    if (!id || isNaN(id)) {
        res.status(400).send("ID must be a valid number");
    }

    try {
        const { error } = await supabase
            .from('notes')
            .update({
                title: title,
                content: content,
            })
            .eq("id", id);
        if (error) {
            res.send(error);
            return;
        }
        res.json({ title: title, content: content });
        return;
    } catch (error) {
        res.status(500).send("Oops, something went wrong");
        return;
    }
});

app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
        res.status(400).send("ID field required");
        return;
    }

    try {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq("id", id);
        if (error) {
            res.send(error);
            return;
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).send("Oops, something went wrong");
    }
});

app.listen(9000, () => {
    console.log("server running on localhost:9000");
})


