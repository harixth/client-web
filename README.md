# Spylt Drivers Finder

## Getting Started

1. Clone this Repository `git clone https://github.com/harixth/client-web.git`
2. Install npm Dependencies

```
npm install
```

3. Signup/Login for [MAPBOX](https://www.mapbox.com/) and get an ACCESS TOKEN
4. Create a new `.env` file at the root project

```
touch .env
```

5. update the file with the folliwing value

```
VITE_MAPBOX_KEY={{ACCESS TOKEN obtain from MapBox}}
```

6. Run the Project

```
npm run dev
```

6. Application should be running at `http:localhost:3000`

## How to use

1. On the main page, drag the map to change the location of the pickup point
2. Move the slider to change the number of drivers that can be displayed
