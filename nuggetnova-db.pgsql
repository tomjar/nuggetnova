--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5 (Ubuntu 12.5-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.5 (Ubuntu 12.5-0ubuntu0.20.04.1)

CREATE DATABASE "nuggetnova-db"
  WITH OWNER = postgres
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'en_US.UTF-8'
       LC_CTYPE = 'en_US.UTF-8'
       CONNECTION LIMIT = -1;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: nn; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA nn;


ALTER SCHEMA nn OWNER TO postgres;

--
-- Name: SCHEMA nn; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA nn IS 'this schema is for nuggetnova';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Event; Type: TABLE; Schema: nn; Owner: postgres
--

CREATE TABLE nn."Event" (
    id uuid NOT NULL,
    ip_address character varying(80) NOT NULL,
    category character varying(20) NOT NULL,
    description text NOT NULL,
    createtimestamp timestamp with time zone NOT NULL
);


ALTER TABLE nn."Event" OWNER TO postgres;

--
-- Name: Message; Type: TABLE; Schema: nn; Owner: postgres
--

CREATE TABLE nn."Message" (
    id uuid NOT NULL,
    ip_address character varying(80) NOT NULL,
    body character varying(512) NOT NULL,
    createtimestamp timestamp with time zone NOT NULL,
    createdby character varying(100)
);


ALTER TABLE nn."Message" OWNER TO postgres;

--
-- Name: Post; Type: TABLE; Schema: nn; Owner: postgres
--

CREATE TABLE nn."Post" (
    id uuid NOT NULL,
    header character varying(150) NOT NULL,
    createtimestamp timestamp with time zone NOT NULL,
    modifytimestamp timestamp with time zone,
    ispublished boolean NOT NULL,
    description character varying(250) NOT NULL,
    name character varying(50) NOT NULL,
    category character varying(50),
    body text DEFAULT ''::text NOT NULL
);


ALTER TABLE nn."Post" OWNER TO postgres;

--
-- Name: Settings; Type: TABLE; Schema: nn; Owner: postgres
--

CREATE TABLE nn."Settings" (
    id uuid NOT NULL,
    archive_view character varying(30) NOT NULL,
    about_section text NOT NULL
);


ALTER TABLE nn."Settings" OWNER TO postgres;

--
-- Name: Supersecretpassword; Type: TABLE; Schema: nn; Owner: postgres
--

CREATE TABLE nn."Supersecretpassword" (
    key character varying(512) NOT NULL,
    salt character varying(256),
    id uuid NOT NULL
);


ALTER TABLE nn."Supersecretpassword" OWNER TO postgres;

--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: nn; Owner: postgres
--

ALTER TABLE ONLY nn."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: nn; Owner: postgres
--

ALTER TABLE ONLY nn."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: nn; Owner: postgres
--

ALTER TABLE ONLY nn."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: Settings Settings_pkey; Type: CONSTRAINT; Schema: nn; Owner: postgres
--

ALTER TABLE ONLY nn."Settings"
    ADD CONSTRAINT "Settings_pkey" PRIMARY KEY (id);


--
-- Name: Supersecretpassword Supersecretpassword_pkey; Type: CONSTRAINT; Schema: nn; Owner: postgres
--

ALTER TABLE ONLY nn."Supersecretpassword"
    ADD CONSTRAINT "Supersecretpassword_pkey" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--