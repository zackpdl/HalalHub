--
-- PostgreSQL database dump
--

-- Dumped from database version 15.10 (Homebrew)
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: zackpdl
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO zackpdl;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: zackpdl
--

CREATE TABLE public.admins (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone
);


ALTER TABLE public.admins OWNER TO zackpdl;

--
-- Name: favorites; Type: TABLE; Schema: public; Owner: zackpdl
--

CREATE TABLE public.favorites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    restaurant_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.favorites OWNER TO zackpdl;

--
-- Name: hosts; Type: TABLE; Schema: public; Owner: zackpdl
--

CREATE TABLE public.hosts (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(15),
    name character varying(255)
);


ALTER TABLE public.hosts OWNER TO zackpdl;

--
-- Name: hosts_id_seq; Type: SEQUENCE; Schema: public; Owner: zackpdl
--

CREATE SEQUENCE public.hosts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hosts_id_seq OWNER TO zackpdl;

--
-- Name: hosts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zackpdl
--

ALTER SEQUENCE public.hosts_id_seq OWNED BY public.hosts.id;


--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: zackpdl
--

CREATE TABLE public.menu_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    restaurant_id uuid,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    image_url text,
    is_available boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.menu_items OWNER TO zackpdl;

--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: zackpdl
--

CREATE TABLE public.restaurants (
    id integer NOT NULL,
    restaurant_name character varying(100) NOT NULL,
    address character varying(255) NOT NULL,
    city character varying(100) NOT NULL,
    cuisine character varying(100) NOT NULL,
    opening_hours time without time zone NOT NULL,
    closing_hours time without time zone NOT NULL,
    halal_cert_type character varying(50),
    halal_cert_number character varying(100),
    halal_cert_expiry date,
    host_id integer
);


ALTER TABLE public.restaurants OWNER TO zackpdl;

--
-- Name: restaurants_id_seq; Type: SEQUENCE; Schema: public; Owner: zackpdl
--

CREATE SEQUENCE public.restaurants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.restaurants_id_seq OWNER TO zackpdl;

--
-- Name: restaurants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zackpdl
--

ALTER SEQUENCE public.restaurants_id_seq OWNED BY public.restaurants.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: zackpdl
--

CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    restaurant_id uuid,
    user_id uuid,
    rating integer NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    customer_name character varying(255),
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO zackpdl;

--
-- Name: users; Type: TABLE; Schema: public; Owner: zackpdl
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    full_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    password text NOT NULL
);


ALTER TABLE public.users OWNER TO zackpdl;

--
-- Name: hosts id; Type: DEFAULT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.hosts ALTER COLUMN id SET DEFAULT nextval('public.hosts_id_seq'::regclass);


--
-- Name: restaurants id; Type: DEFAULT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.restaurants ALTER COLUMN id SET DEFAULT nextval('public.restaurants_id_seq'::regclass);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: zackpdl
--

COPY public.admins (id, email, password_hash, created_at, last_login) FROM stdin;
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: zackpdl
--

COPY public.favorites (id, user_id, restaurant_id, created_at) FROM stdin;
\.


--
-- Data for Name: hosts; Type: TABLE DATA; Schema: public; Owner: zackpdl
--

COPY public.hosts (id, email, password, phone, name) FROM stdin;
6	admin@example.com	$2b$10$sgC3VUgLGqFDOgpaa/PFxu5pFcQ97ic5zsjYVv1GZG40t9fjGezHe	099876	\N
7	tom@example.com	$2b$10$gglqmcVDnCYPIwd7N8nYK.RAN/O.KYZt55VdtjYmhXP/9XCgECZFW	098512	\N
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: zackpdl
--

COPY public.menu_items (id, restaurant_id, name, description, price, image_url, is_available, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: zackpdl
--

COPY public.restaurants (id, restaurant_name, address, city, cuisine, opening_hours, closing_hours, halal_cert_type, halal_cert_number, halal_cert_expiry, host_id) FROM stdin;
3	Tom	1 st	bkk		05:00:00	22:00:00	Certified	JAKIM-2025-001	2025-12-31	6
4	Tom Yum Goong	Tom Yum Goong, 4/17 Moo 2 Lam Kaen, Thai Mueang District, Phang Nga 82210	Khaolak		10:00:00	22:00:00	Certified	JAKIM-2026-001	2026-12-31	7
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: zackpdl
--

COPY public.reviews (id, restaurant_id, user_id, rating, comment, created_at, updated_at, customer_name) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: zackpdl
--

COPY public.users (id, email, full_name, created_at, updated_at, password) FROM stdin;
\.


--
-- Name: hosts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zackpdl
--

SELECT pg_catalog.setval('public.hosts_id_seq', 7, true);


--
-- Name: restaurants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zackpdl
--

SELECT pg_catalog.setval('public.restaurants_id_seq', 4, true);


--
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_user_id_restaurant_id_key; Type: CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_restaurant_id_key UNIQUE (user_id, restaurant_id);


--
-- Name: hosts hosts_email_key; Type: CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.hosts
    ADD CONSTRAINT hosts_email_key UNIQUE (email);


--
-- Name: hosts hosts_pkey; Type: CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.hosts
    ADD CONSTRAINT hosts_pkey PRIMARY KEY (id);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: menu_items update_menu_items_updated_at; Type: TRIGGER; Schema: public; Owner: zackpdl
--

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: reviews update_reviews_updated_at; Type: TRIGGER; Schema: public; Owner: zackpdl
--

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: zackpdl
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: restaurants restaurants_host_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_host_id_fkey FOREIGN KEY (host_id) REFERENCES public.hosts(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: admins; Type: ROW SECURITY; Schema: public; Owner: zackpdl
--

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

--
-- Name: favorites; Type: ROW SECURITY; Schema: public; Owner: zackpdl
--

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

--
-- Name: menu_items; Type: ROW SECURITY; Schema: public; Owner: zackpdl
--

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

--
-- Name: reviews; Type: ROW SECURITY; Schema: public; Owner: zackpdl
--

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: zackpdl
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

