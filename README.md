## Daily Dose of Art

This project was inspired by a hypothetical assignment from The MET, challenging me to create a digital tool to increase audience engagement with art. The result is a cloud-native, React-based single page application that delivers users a new artwork from The MET’s collection each day, with the ability to save favorites and set personal preferences for style, medium, and period. The app features a visually rich interface themed in MET’s signature red, a historic serif title font, and a responsive layout. All user favorites and preferences are stored in browser local storage for privacy and seamless experience.

A major focus was the implementation of a robust preference filtering system. Users can select any combination of unique styles, mediums, and periods represented in The MET’s API, and the app will do its best to tailor the randomness of the artwork selection toward those tastes. Due to the complexity of the API and the challenge of combining multiple filters, I iteratively refined the logic using both API-side and client-side filtering, though it was not always possible to guarantee a perfect match for all selected preferences. Features like the MET-red themed UI, bold historic title font, and button-styled links were refined through multiple iterations and community feedback. The application is containerized with Docker, served via Nginx on an AWS EC2 instance, and is continuously updated from GitHub. Please see the diagram below for an overview of the architecture.

---

## Architecture

![App Architecture](AWS-App-Architectu Stack

- **React** (SPA front-end)
- **Docker** (App containerization)
- **Nginx** (Reverse proxy & static file server)
- **AWS EC2** (Cloud hosting)
- **GitHub** (Source code management & deployment)
- **The MET API** (Artwork data)
- **Local Storage** (Favorites & preferences)

---

## Usage

1. Clone the repo and follow the deployment instructions in the codebase.
2. Set your preferences for style, medium, and period.
3. Enjoy a tailored daily dose of art, save favorites, and explore the collection!

---

## License

This project is for educational and demonstration purposes only.
