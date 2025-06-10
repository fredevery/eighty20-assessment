import { useState, useEffect } from "react";
import { Form, useActionData } from "react-router-dom";
import Frame from "../components/Frame";

import styles from './Login.module.css';

type FormResponse = {
    ok: boolean;
    detail?: string;
} | undefined;

function ErrorMessage ({ message }: { message?: string }) {
    return (
        <Frame className={styles.errorMessage} error={true}>
            <div className={styles.errorHeader}>
                Wild ERROR appeared!
            </div>
            <div className={styles.errorDetail}>
                {message ? message : "Login failed. Please try again."}
            </div>
        </Frame>
    )
}

export default function Login() {
    const formResponse = useActionData() as FormResponse;
    const [showError, setShowError] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (formResponse) {
            setSubmitting(false)
            
            if (!formResponse.ok) {
                setShowError(true);
            }
        }
    }, [formResponse]);

    return (
        <div className={styles.pageContainer}>
            <Frame className={styles.formContainer}>
                <Form className={[styles.form, submitting && styles.submitting].filter(Boolean).join(' ')} 
                    method="post" 
                    action="/login" 
                    onChange={() => setShowError(false)}
                    onSubmit={() => setSubmitting(true)}>
                    <div className={styles.title}>Login</div>
                    <div className={styles.field}>
                        <input type="email" name="email" placeholder="Email" required />
                    </div>
                    <div className={styles.field}>
                        <input type="password" name="password" placeholder="Password" required />
                    </div>
                    <button type="submit" disabled={submitting}>{ submitting ? `...` : `Login`}</button>
                </Form>

                {showError && formResponse && !formResponse.ok && (
                    <ErrorMessage message={formResponse.detail} />
                )}
            </Frame>
        </div>
    )
}