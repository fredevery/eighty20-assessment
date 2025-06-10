import { useLoaderData, Form } from "react-router-dom";
import Frame from "../components/Frame";
import { type User } from "../stores"

import styles from './Home.module.css';

export default function Home() {
    const user = useLoaderData() as User;
    return (
        <div className={styles.homePage}>
            <div className={styles.pokemon}>
                <img src={`${import.meta.env.VITE_SPRITES_URL}/${user.favouritePokemon.spriteFilename}`} />
            </div>
            <Frame className={styles.welcomeFrame}>
                <div className={styles.welcomeContent}>
                    <div className={styles.welcomeMessage}>
                        <h1>Welcome { (user.firstName || 'USER').toUpperCase() }!</h1>
                        <p>Your favourite Pokemon is: { user.favouritePokemon.name.toUpperCase() }</p>
                    </div>
                    <div className={styles.logoutButton}>
                        <Form method="post" action="/logout">
                            <button type="submit">Logout</button>
                        </Form>
                    </div>
                </div>
            </Frame>
        </div>
    )
}