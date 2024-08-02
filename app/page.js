'use client'
import { Box, Stack, Typography, Button, Modal, TextField, Fade, Backdrop } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, getDoc, query, setDoc, doc, deleteDoc, getDocs} from "firebase/firestore";
import { useEffect, useState } from "react";

// Styles for the modal component
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#2b2b2b', // Dark background color
  borderRadius: 4, // Rounded corners
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  color: 'white', // White text color
};

// Main component
export default function Home() {
  // State variables
  const [open, setOpen] = useState(false); // State for modal visibility
  const [pantryList, setPantry] = useState([]); // State for pantry items
  const [itemName, setItemName] = useState(''); // State for item name input
  const [itemQuantity, setItemQuantity] = useState(''); // State for item quantity input
  const [expirationDate, setExpirationDate] = useState(''); // State for expiration date input
  const [searchTerm, setSearchTerm] = useState('');
  const [fullPantryList, setFullPantryList] = useState([]);
  const [filteredPantryList, setFilteredPantryList] = useState([]);
  





  // Function to open the modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to close the modal
  const handleClose = () => {
    setOpen(false);
  };
// Function to fetch and update the pantry items from Firestore
const updatePantry = async () => {
  const snapshot = query(collection(firestore, "pantry")); // Querying the "pantry" collection
  const docs = await getDocs(snapshot); // Fetching documents from Firestore
  const pantryList = [];
  docs.forEach((doc) => {
    pantryList.push({ id: doc.id, ...doc.data() }); // Adding document data to pantryList
  });
  console.log(pantryList); // Logging pantryList for debugging
  //setPantry(pantryList); // Updating state with fetched data
  setFullPantryList(pantryList); // Setting full list
  setFilteredPantryList(pantryList); // Setting filtered list to full list initially
};


// Effect to fetch pantry items on component mount
useEffect(() => {
  updatePantry();
}, []);

// Function to add a new item to the pantry or update the quantity if it exists
const addItem = async () => {
  const docRef = doc(collection(firestore, "pantry"), itemName); // Reference for the item
  const docSnap = await getDoc(docRef); // Get the document from Firestore

  if (docSnap.exists()) {
    // If the item already exists, update its quantity
    const existingData = docSnap.data();
    const newQuantity = existingData.quantity + parseInt(itemQuantity, 10);
    await setDoc(docRef, { quantity: newQuantity }, { merge: true });
  } else {
    // If the item does not exist, create a new document
    await setDoc(docRef, { name: itemName, quantity: parseInt(itemQuantity, 10), expirationDate });
  }

  updatePantry(); // Refreshing the pantry list
  setItemName(''); // Clearing input fields
  setItemQuantity('');
  setExpirationDate('');
  handleClose(); // Closing the modal
};

// Function to remove one unit of an item from the pantry
const removeItem = async (id, currentQuantity) => {
  const docRef = doc(firestore, "pantry", id);

  if (currentQuantity > 1) {
    // If quantity is more than one, decrement it
    await setDoc(docRef, { quantity: currentQuantity - 1 }, { merge: true });
  } else {
    // If quantity is one, remove the item completely
    await deleteDoc(docRef);
  }

  updatePantry(); // Refreshing the pantry list
};

// Function to search for an item by name
const searchItem = () => {
  const lowercasedSearchTerm = searchTerm.toLowerCase();
  const filteredItems = fullPantryList.filter(item =>
    item.name.toLowerCase().includes(lowercasedSearchTerm)
  );
  setFilteredPantryList(filteredItems); // Update the filtered list based on search term
};




  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
            <Box
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        {/* Search Input and Button */}
        <Box display="flex" alignItems="center" gap={2}
        paddingInlineStart={70}
        paddingY={1}
       >
          <TextField
            id="search-item"
            label="Search Item"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              searchItem(); // Filter items as search term changes
            }}
            InputLabelProps={{ style: { color: 'white' } }}
            sx={{ input: { color: 'white' }, '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
          />
          <Button
            variant="contained"
            onClick={searchItem}
            sx={{ bgcolor: '#0a3659', color: 'white' }}
          >
            Search
          </Button>
        </Box>

      {/* Button to open the modal */}
      <Button variant="contained" onClick={handleOpen} sx={{ bgcolor: '#0a3659', color: 'white' }}>
        Add Item
      </Button>

      {/* Modal for adding new pantry items */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-item-modal-title"
        aria-describedby="add-item-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Typography id="add-item-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack spacing={2}>
              {/* Text field for item name input */}
              <TextField
                label="Item Name"
                variant="filled"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                InputProps={{
                  style: { color: 'white', backgroundColor: '#424242' }, // White text and dark background
                }}
                InputLabelProps={{
                  style: { color: '#b0bec5' }, // Lighter label color
                }}
              />
              {/* Text field for item quantity input */}
              <TextField
                label="Quantity"
                variant="filled"
                fullWidth
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
                InputProps={{
                  style: { color: 'white', backgroundColor: '#424242' }, // White text and dark background
                }}
                InputLabelProps={{
                  style: { color: '#b0bec5' }, // Lighter label color
                }}
              />
              {/* Text field for expiration date input */}
              <TextField
                label="Expiration Date"
                type="date"
                variant="filled"
                fullWidth
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                  style: { color: '#b0bec5' }, // Lighter label color
                }}
                InputProps={{
                  style: { color: 'white', backgroundColor: '#424242' }, // White text and dark background
                }}
              />
              {/* Button to add the item */}
              <Button
                variant="outlined"
                onClick={addItem}
                sx={{ bgcolor: '#0a3659', color: 'white' }} // Green button with white text
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>

      {/* Displaying pantry items */}
      <Box border={'1px solid #333'} borderRadius={10}>
        <Box width="100%" height="85px" bgcolor={'#141b35'} borderRadius={10}>
          <Typography
            variant={"h2"}
            color={"white"}
            textAlign={"center"}>
            Pantry Items
          </Typography>
        </Box>

        <Stack width="800px" height={"500px"} spacing={2} overflow={'auto'} borderRadius={4} >
          {filteredPantryList.map((item) => (
            <Stack
            key={item.id}
            spacing={2}
            alignItems={'center'}
            justifyContent={'center'}
            bgcolor={'#24305a'}
            border={'1px solid #333'}
            borderRadius={2}
            p={2}
            width="100%"
            height={"300px"}
            paddingY={2}
          >
            {/* Item Name */}
            <Typography
              variant={"h5"}
              color={"white"}
              textAlign={"center"}
            >
              {item.name ? item.name.charAt(0).toUpperCase() + item.name.slice(1) : ''}
            </Typography>
        
            {/* Quantity and Expiration Date */}
            <Stack
              direction="row"
              spacing={4}
              justifyContent="space-between"
              width="100%"
            >
              <Box display="flex" justifyContent="center" flexGrow={1}>
                <Typography variant={"body1"} color={"white"} textAlign={"center"}>
                  Quantity: {item.quantity}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="center" flexGrow={1}>
                <Typography variant={"body1"} color={"white"} textAlign={"center"}>
                  Expiration: {item.expirationDate}
                </Typography>
              </Box>
            </Stack>
        
            {/* Remove Button */}
            <Button
              variant="contained"
              onClick={() => removeItem(item.id,item.quantity)}
              sx={{ bgcolor: '#ef5350', color: 'white' }}
            >
              Remove
            </Button>
          </Stack>
        ))}
     
        </Stack>
      </Box>
    </Box>
  </Box>
  );
}
