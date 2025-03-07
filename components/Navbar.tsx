"use client";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo-white.png";
import { useUser } from "@clerk/nextjs";
import styles from "@/css/styles.module.css";
import { useAtom } from "jotai";
import CheckoutButton from "./stripe-payment";
import { subscriptionStatusAtom } from "@/types/atoms";

const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const [subscriptionStatus, setSubscriptionStatus] = useAtom(
    subscriptionStatusAtom
  );

  useEffect(() => {
    function getSubscriptionStatus() {
      if (!isSignedIn) {
        setSubscriptionStatus("");
        return;
      }

      setSubscriptionStatus(
        user?.publicMetadata?.stripe?.subscriptionStatus as string
      );
    }
    getSubscriptionStatus();
  }, [user, setSubscriptionStatus, isSignedIn]);

  return (
    <div>
      <div className={styles.navContainer}>
        <div className={styles.navWrapper}>
          <div className={styles.navLeft}>
            <div className={styles.navLeftLinks}>
              <Link href="/" className={styles.navLeftLink}>
                <Image
                  src={logo}
                  alt="Budget Management Home Logo"
                  width={45}
                  height={45}
                  className={styles.logo}
                />
              </Link>
            </div>
          </div>
          <div className={styles.navMiddle}></div>
          <div className={styles.navRight}>
            <div className={styles.navRightLinks}>
              <Link href="/" className={styles.homeLink}>
                Home
              </Link>
              {isLoaded && isSignedIn ? (
                <>
                  <Link
                    href={`/budget/${
                      new Date().getMonth() + 1
                    }/${new Date().getFullYear()}`}
                    className={styles.link}
                  >
                    Budget Management
                  </Link>
                  {(subscriptionStatus === "active" ||
                    subscriptionStatus === "trial") &&
                    isSignedIn && (
                      <>
                        <div className={styles.link}>
                          <Link
                            href={`${process.env.NEXT_PUBLIC_BASE_URL}api/create-portal-link/${user.id}`}
                            className={styles.link}
                          >
                            Manage Subscription
                          </Link>
                        </div>
                      </>
                    )}
                  <div>
                    {(subscriptionStatus === "none" ||
                      subscriptionStatus === "" ||
                      !subscriptionStatus) &&
                      isSignedIn && <CheckoutButton />}
                  </div>
                  <div className={styles.link}>
                    <SignOutButton />
                  </div>
                </>
              ) : (
                <div className={styles.link}>
                  <SignInButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
