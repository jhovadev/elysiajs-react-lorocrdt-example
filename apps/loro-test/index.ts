import { LoroDoc } from 'loro-crdt';

function test() {
    const doc = new LoroDoc();

    doc.setPeerId('1');

    const text = doc.getText("text");
    const list = doc.getList("list");
    const map = doc.getMap("map");
    const tree = doc.getTree("tree");
    const movableList = doc.getMovableList("tasks");

    text.insert(0, "Hello, world!");
    text.insert(1, "This is a test document.");

    list.insert(0, "Item 1");
    list.insert(1, 2);
    list.insert(2, ["a", "b", "c"]);
    list.insert(0, 4.3);
    console.log(list.toArray());

    map.set("key1", "value1");
    map.set("key2", 42);
    map.set("key3", true);
    map.set("key4", ["a", "b", "c"]);
    console.log(map.toJSON());;

    console.log(text.toString());

}

async function test_realtime() {
    const doc_a = new LoroDoc();
    doc_a.setPeerId('1');
    const text_a = doc_a.getText("text");

    const doc_b = new LoroDoc();
    doc_b.setPeerId('2');
    const text_b = doc_b.getText("text");

    // Subscribe to updates from doc_a
    doc_a.subscribeLocalUpdates((update) => {
        console.log('Local update detected, size:', update.length);
        doc_b.import(update);
    });

    // Subscribe to updates from doc_b
    doc_b.subscribeLocalUpdates((update) => {
        console.log('Local update detected, size:', update.length);
        doc_a.import(update);
    });

    // Make some changes to doc_a
    text_a.insert(0, "a");
    text_a.insert(1, "z");

    // Make some changes to doc_b
    text_b.insert(0, "b");
    text_b.insert(1, "x");

    // doc_a.commit();

    console.log('Initial state:', doc_a.export({ mode: "snapshot" }));
    console.log(doc_a.getText("text").toString());
    // doc_b.commit();

    console.log('Initial state:', doc_b.export({ mode: "snapshot" }));


    console.log(doc_b.getText("text").toString());
    // Wait for a few seconds
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Print the final state of both documents
    console.log('Final state of doc_a:', doc_a.export({ mode: "snapshot" }));
    console.log('Final state of doc_b:', doc_b.export({ mode: "snapshot" }));
}



// console.log('Initial state:', doc.export({ mode: "snapshot" }));