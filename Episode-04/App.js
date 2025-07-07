import React from "react";
import ReactDOM from "react-dom/client";
import logo from "./logo.jpg";
const restaurantList = [
  // --- Original 15 Objects (Updated) ---
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "334475",
      name: "KFC",
      uuid: "eaed0e3b-7c0e-4367-8f59-f41d309fb93a",
      city: "1",
      area: "BTM Layout",
      totalRatingsString: "500+ ratings",
      cloudinaryImageId: "bdcd233971b7c81bf77e1fa4471280eb",
      imageUrl:
        "https://images.pexels.com/photos/10599426/pexels-photo-10599426.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Burgers", "Biryani", "American", "Snacks", "Fast Food"],
      avgRating: "3.8",
      costForTwoString: "₹400 FOR TWO",
      deliveryTime: 36,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "229",
      name: "Meghana Foods",
      uuid: "4fdd19e2-5d0f-4bde-9c7f-dc3e8d36021f",
      city: "1",
      area: "Koramangala",
      totalRatingsString: "1000+ ratings",
      cloudinaryImageId: "xqwpuhgnsaf18te7zvtv",
      imageUrl:
        "https://www.themealdb.com/images/media/meals/urtpqw1487341253.jpg",
      cuisines: [
        "Biryani",
        "Andhra",
        "South Indian",
        "North Indian",
        "Chinese",
        "Seafood",
      ],
      avgRating: "4.4",
      costForTwoString: "₹500 FOR TWO",
      deliveryTime: 29,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "121603",
      name: "Kannur Food Point",
      uuid: "51983905-e698-4e31-b0d7-e376eca56320",
      city: "1",
      area: "Tavarekere",
      totalRatingsString: "5000+ ratings",
      cloudinaryImageId: "bmwn4n4bn6n1tcpc8x2h",
      imageUrl:
        "https://www.themealdb.com/images/media/meals/xutquv1505330523.jpg",
      cuisines: ["Kerala", "Chinese"],
      avgRating: "3.8",
      costForTwoString: "₹300 FOR TWO",
      deliveryTime: 31,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "307050",
      name: "Call Me Chow",
      uuid: "b9bf2a17-faf9-4e4a-a6a7-61197d4bafa0",
      city: "1",
      area: "Koramangala",
      totalRatingsString: "1000+ ratings",
      cloudinaryImageId: "soegobqsiqvhmkfvnnkj",
      imageUrl: "https://www.themealdb.com/images/media/meals/1529445893.jpg",
      cuisines: ["Chinese", "Pan-Asian"],
      avgRating: "4.3",
      costForTwoString: "₹400 FOR TWO",
      deliveryTime: 29,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "337335",
      name: "Kannur food kitchen",
      uuid: "c70b61bc-0f68-4e24-996b-749fbf295c35",
      city: "1",
      area: "BTM Layout",
      totalRatingsString: "1000+ ratings",
      cloudinaryImageId: "a27weqanhnszqiuzsoik",
      imageUrl:
        "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Kerala", "Biryani", "Beverages"],
      avgRating: "3.8",
      costForTwoString: "₹200 FOR TWO",
      deliveryTime: 30,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "492159",
      name: "Roti Wala",
      uuid: "ada41f9b-cca3-4197-805c-8c43798919e9",
      city: "1",
      area: "Koramangala",
      totalRatingsString: "100+ ratings",
      cloudinaryImageId: "f99d05e4f7884caa8646c70b0b752c7a",
      imageUrl:
        "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Home Food", "North Indian", "Thalis"],
      avgRating: "4.1",
      costForTwoString: "₹200 FOR TWO",
      deliveryTime: 36,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "65797",
      name: "Leon's - Burgers & Wings",
      uuid: "b5747bab-748b-4f2d-8856-25cd9a49efb3",
      city: "1",
      area: "Koramangala",
      totalRatingsString: "1000+ ratings",
      cloudinaryImageId: "r4ufflqojich0r29efvc",
      imageUrl:
        "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["American", "Snacks", "Turkish", "Portuguese", "Continental"],
      avgRating: "4.3",
      costForTwoString: "₹300 FOR TWO",
      deliveryTime: 29,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "425",
      name: "Hotel Empire",
      uuid: "c0c37758-2e83-4429-aad6-eb94debb48f5",
      city: "1",
      area: "Koramangala",
      totalRatingsString: "1000+ ratings",
      cloudinaryImageId: "un4omn7rcunkmlw6vikr",
      imageUrl:
        "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["North Indian", "Kebabs", "Biryani"],
      avgRating: "4.1",
      costForTwoString: "₹450 FOR TWO",
      deliveryTime: 30,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "428",
      name: "Biryani Pot",
      uuid: "6db20a8b-dd85-4148-b750-107169f7f826",
      city: "1",
      area: "Btm Layout",
      totalRatingsString: "1000+ ratings",
      cloudinaryImageId: "mdipoyzfzsa7n7igskht",
      imageUrl:
        "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["North Indian", "Biryani"],
      avgRating: "3.8",
      costForTwoString: "₹500 FOR TWO",
      deliveryTime: 25,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "306639",
      name: "The Coorg Food Co.",
      uuid: "318c2c99-1173-42a8-b56c-f655e3cc5ffd",
      city: "1",
      area: "Koramangala",
      totalRatingsString: "100+ ratings",
      cloudinaryImageId: "ej90ytd5x7ffyl6ii7cn",
      imageUrl:
        "https://images.pexels.com/photos/3754692/pexels-photo-3754692.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["South Indian"],
      avgRating: "4.3",
      costForTwoString: "₹750 FOR TWO",
      deliveryTime: 28,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "63957",
      name: "Madeena Hotel",
      uuid: "da15d34a-cf0f-40a6-8600-096309bb578b",
      city: "1",
      area: "Koramangala",
      totalRatingsString: "1000+ ratings",
      cloudinaryImageId: "yc0asfa2j9elggstyjg4",
      imageUrl:
        "https://www.themealdb.com/images/media/meals/qptpvt1487339892.jpg",
      cuisines: ["Biryani", "Mughlai", "Indian", "Beverages"],
      avgRating: "4.1",
      costForTwoString: "₹250 FOR TWO",
      deliveryTime: 29,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "71298",
      name: "Bengali Fun Foods",
      uuid: "a697d14f-c13a-49cb-8414-d12fa56bcc3b",
      city: "1",
      area: "BTM Layout",
      totalRatingsString: "500+ ratings",
      cloudinaryImageId: "ub9ng9le0lf7opxxbxey",
      imageUrl:
        "https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg",
      cuisines: ["North Indian", "Bengali"],
      avgRating: "4.3",
      costForTwoString: "₹300 FOR TWO",
      deliveryTime: 27,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "59593",
      name: "Al Daaz",
      uuid: "c189b92c-d842-4595-9a1f-ff85bd67bc2a",
      city: "1",
      area: "Hsr Layout",
      totalRatingsString: "100+ ratings",
      cloudinaryImageId: "rxsvhvcdip9dbfdijzk9",
      imageUrl:
        "https://images.pexels.com/photos/1056553/pexels-photo-1056553.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: [
        "American",
        "Arabian",
        "Chinese",
        "Desserts",
        "Mughlai",
        "North Indian",
      ],
      avgRating: "4.3",
      costForTwoString: "₹400 FOR TWO",
      deliveryTime: 40,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "5934",
      name: "Burger King",
      uuid: "ac56f2ac-71d3-4978-9513-b3aa68e25463",
      city: "1",
      area: "Koramangala",
      totalRatingsString: "1000+ ratings",
      cloudinaryImageId: "jpohkfkofao0hxez7vdh",
      imageUrl:
        "https://images.pexels.com/photos/2987564/pexels-photo-2987564.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Burgers", "American"],
      avgRating: "4.2",
      costForTwoString: "₹350 FOR TWO",
      deliveryTime: 31,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "365010",
      name: "Hotel Salam",
      uuid: "0a29b957-8817-4d4c-bc32-ca009921472d",
      city: "1",
      area: "Bommanahalli",
      totalRatingsString: "500+ ratings",
      cloudinaryImageId: "hgdmw8uwgewhiewwovjh",
      imageUrl:
        "https://images.pexels.com/photos/9213190/pexels-photo-9213190.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Biryani", "Tandoor", "Arabian", "Indian", "Beverages"],
      avgRating: "3.9",
      costForTwoString: "₹250 FOR TWO",
      deliveryTime: 31,
    },
  },

  // --- New Objects Added For More Variety ---
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "701234",
      name: "Toscano's Pizzeria",
      uuid: "b1d8a3b4-4c12-4e89-9a1b-cd253c3e8e1f",
      city: "1",
      area: "Indiranagar",
      totalRatingsString: "2000+ ratings",
      cloudinaryImageId: "placeholder_for_toscano",
      imageUrl:
        "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Pizza", "Italian", "Pastas", "Desserts"],
      avgRating: "4.5",
      costForTwoString: "₹700 FOR TWO",
      deliveryTime: 45,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "701235",
      name: "Vidyarthi Bhavan",
      uuid: "c2e9b4c5-5d23-4f9a-8b2c-de364d4f9f2a",
      city: "1",
      area: "Basavanagudi",
      totalRatingsString: "10000+ ratings",
      cloudinaryImageId: "placeholder_for_vidyarthi",
      imageUrl:
        "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["South Indian", "Breakfast", "Snacks"],
      avgRating: "4.7",
      costForTwoString: "₹150 FOR TWO",
      deliveryTime: 38,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "701236",
      name: "Taco Bell",
      uuid: "d3f0a5d6-6e34-4aab-9c3d-ef475e5a0a3b",
      city: "1",
      area: "Indiranagar",
      totalRatingsString: "1000+ ratings",
      cloudinaryImageId: "placeholder_for_taco_bell",
      imageUrl:
        "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Mexican", "Wraps", "Fast Food"],
      avgRating: "4.2",
      costForTwoString: "₹500 FOR TWO",
      deliveryTime: 33,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "701237",
      name: "Corner House Ice Creams",
      uuid: "e4a1b6e7-7f45-4baa-8d4e-ff586f6b1b4c",
      city: "1",
      area: "Jayanagar",
      totalRatingsString: "5000+ ratings",
      cloudinaryImageId: "placeholder_for_corner_house",
      imageUrl:
        "https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Ice Cream", "Desserts", "Shakes"],
      avgRating: "4.8",
      costForTwoString: "₹250 FOR TWO",
      deliveryTime: 25,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "701238",
      name: "Subway",
      uuid: "f5b2c7f8-8a56-4ca9-9e5f-00697a7c2c5d",
      city: "1",
      area: "Whitefield",
      totalRatingsString: "1000+ ratings",
      cloudinaryImageId: "placeholder_for_subway",
      imageUrl:
        "https://images.pexels.com/photos/106349/pexels-photo-106349.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Salads", "Snacks", "Healthy Food", "Fast Food"],
      avgRating: "4.0",
      costForTwoString: "₹400 FOR TWO",
      deliveryTime: 28,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "701239",
      name: "FreshPress Salads",
      uuid: "a0d3e8a9-9b67-4daa-8f6a-117a8b8d3d6e",
      city: "1",
      area: "Koramangala",
      totalRatingsString: "500+ ratings",
      cloudinaryImageId: "placeholder_for_freshpress",
      imageUrl:
        "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Salads", "Healthy Food", "Juices"],
      avgRating: "4.4",
      costForTwoString: "₹450 FOR TWO",
      deliveryTime: 35,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "701240",
      name: "Anand Sweets and Savouries",
      uuid: "b1e4f9ba-ab78-4eab-9g7b-228b9c9e4e7f",
      city: "1",
      area: "Jayanagar",
      totalRatingsString: "5000+ ratings",
      cloudinaryImageId: "placeholder_for_anand",
      imageUrl:
        "https://images.pexels.com/photos/9748888/pexels-photo-9748888.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Sweets", "Chaat", "Snacks", "Desserts"],
      avgRating: "4.6",
      costForTwoString: "₹200 FOR TWO",
      deliveryTime: 30,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "701241",
      name: "Domino's Pizza",
      uuid: "c2f5a0ca-bc89-4fbc-8h8c-339c0d0f5f8a",
      city: "1",
      area: "Marathahalli",
      totalRatingsString: "3000+ ratings",
      cloudinaryImageId: "placeholder_for_dominos",
      imageUrl:
        "https://images.pexels.com/photos/8254729/pexels-photo-8254729.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Pizza", "Italian", "Pastas", "Desserts"],
      avgRating: "4.1",
      costForTwoString: "₹400 FOR TWO",
      deliveryTime: 30,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "701242",
      name: "Thai House",
      uuid: "d3g6b1db-cd90-4abc-9i9d-440d1e1g6g9b",
      city: "1",
      area: "Indiranagar",
      totalRatingsString: "1000+ ratings",
      cloudinaryImageId: "placeholder_for_thai_house",
      imageUrl: "https://www.themealdb.com/images/media/meals/1529444830.jpg",
      cuisines: ["Thai", "Asian", "Seafood"],
      avgRating: "4.3",
      costForTwoString: "₹800 FOR TWO",
      deliveryTime: 48,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "701243",
      name: "Onesta",
      uuid: "e4h7c2ec-de01-4cde-8j0e-551e2f2h7h0c",
      city: "1",
      area: "HSR Layout",
      totalRatingsString: "5000+ ratings",
      cloudinaryImageId: "placeholder_for_onesta",
      imageUrl:
        "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Pizza", "Pastas", "Italian", "Desserts"],
      avgRating: "4.2",
      costForTwoString: "₹600 FOR TWO",
      deliveryTime: 42,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "701244",
      name: "Wow! Momo",
      uuid: "f5i8d3fd-ef12-4def-9k1f-662f3a3i8i1d",
      city: "1",
      area: "Koramangala",
      totalRatingsString: "2000+ ratings",
      cloudinaryImageId: "placeholder_for_wow_momo",
      imageUrl:
        "https://images.pexels.com/photos/5409015/pexels-photo-5409015.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Tibetan", "Chinese", "Snacks"],
      avgRating: "4.1",
      costForTwoString: "₹300 FOR TWO",
      deliveryTime: 28,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "701245",
      name: "Starbucks Coffee",
      uuid: "a0j9e4ae-fa23-4e0a-8l2a-773a4b4j9j2e",
      city: "1",
      area: "Indiranagar",
      totalRatingsString: "1000+ ratings",
      cloudinaryImageId: "placeholder_for_starbucks",
      imageUrl:
        "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Beverages", "Cafe", "Snacks", "Desserts"],
      avgRating: "4.3",
      costForTwoString: "₹700 FOR TWO",
      deliveryTime: 34,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "701246",
      name: "A2B - Adyar Ananda Bhavan",
      uuid: "b1k0f5bf-ab34-4f1b-9m3b-884b5c5k0k3f",
      city: "1",
      area: "BTM Layout",
      totalRatingsString: "10000+ ratings",
      cloudinaryImageId: "placeholder_for_a2b",
      imageUrl:
        "https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["South Indian", "North Indian", "Sweets", "Chinese"],
      avgRating: "4.4",
      costForTwoString: "₹300 FOR TWO",
      deliveryTime: 29,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "701247",
      name: "Behrouz Biryani",
      uuid: "c2l1a6ca-bc45-4a2c-8n4c-995c6d6l1l4a",
      city: "1",
      area: "Koramangala",
      totalRatingsString: "5000+ ratings",
      cloudinaryImageId: "placeholder_for_behrouz",
      imageUrl:
        "https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=600",
      cuisines: [
        "Biryani",
        "Mughlai",
        "North Indian",
        "Lucknowi",
        "Hyderabadi",
        "Kebabs",
        "Desserts",
      ],
      avgRating: "4.3",
      costForTwoString: "₹700 FOR TWO",
      deliveryTime: 40,
    },
  },
  {
    type: "restaurant",
    data: {
      type: "F",
      id: "701248",
      name: "Polar Bear",
      uuid: "d3m2b7db-cd56-4b3d-8o5d-006d7e7m2m5b",
      city: "1",
      area: "Jayanagar",
      totalRatingsString: "1000+ ratings",
      cloudinaryImageId: "placeholder_for_polar_bear",
      imageUrl:
        "https://images.pexels.com/photos/3631/summer-dessert-sweet-ice-cream.jpg?auto=compress&cs=tinysrgb&w=600",
      cuisines: ["Ice Cream", "Desserts", "Sundaes"],
      avgRating: "4.6",
      costForTwoString: "₹350 FOR TWO",
      deliveryTime: 22,
    },
  },
];

const NavBar = () => {
  return (
    <div className="nav">
      <div className="navItems">
        {/* Image not reflecting in the UI need to look into this */}
        {/* <img className="Logo" src={logo.default} alt="Food App Logo" style={{
        width: '100px',
        height: '100px',
        border: '5px solid red'
    }} /> */}
        <div className="logo">
          <img src="https://graphicsfamily.com/wp-content/uploads/edd/2023/02/Restaurant-Logo-Design-2-2048x1152.jpg" />
        </div>
        <div className="items">
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact US</li>
            <li>Cart</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
const Search = () => <div className="restuarantSearch"> Search</div>;
const RestaurantCard = (props) => {
  const { resData } = props;
  const {imageUrl, name, avgRating, cuisines, costForTwoString, deliveryTime } = resData?.data;
  return (
    <div className="restuarantCard">
      <img src={imageUrl}></img>
      <h3>{name}</h3>
      <h4>{cuisines.join(", ")}</h4>
      <h4>{avgRating} stars</h4>
      <h4>₹{costForTwoString}</h4>
      <h4>{deliveryTime}</h4>
    </div>
  );
};
const Body = () => {
  return (
    <div className="bodyContainer">
      <Search />
      <div className="restaurantContainer">
        {restaurantList.map((restuarant) => (
          //  not using Key <<<<<< Using Index as Key <<<<<< Using uniqueId as a key
          <RestaurantCard key={restuarant.data.id} resData={restuarant} />
        ))}
      </div>
    </div>
  );
};
const AppLayOut = () => {
  console.log("App is Running");
  return (
    <div className="appContainer">
      <NavBar />
      <Body />
    </div>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppLayOut />);
