--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Postgres.app)
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
-- Name: menu; Type: TABLE; Schema: public; Owner: zackpdl
--

CREATE TABLE public.menu (
    id integer NOT NULL,
    host_id integer,
    dish_name character varying(255),
    description text,
    price numeric
);


ALTER TABLE public.menu OWNER TO zackpdl;

--
-- Name: menu_id_seq; Type: SEQUENCE; Schema: public; Owner: zackpdl
--

CREATE SEQUENCE public.menu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_id_seq OWNER TO zackpdl;

--
-- Name: menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zackpdl
--

ALTER SEQUENCE public.menu_id_seq OWNED BY public.menu.id;


--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: zackpdl
--

CREATE TABLE public.menu_items (
    id integer NOT NULL,
    menu_id integer,
    name character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    image text,
    description text,
    restaurant_id integer
);


ALTER TABLE public.menu_items OWNER TO zackpdl;

--
-- Name: menu_items_id_seq; Type: SEQUENCE; Schema: public; Owner: zackpdl
--

CREATE SEQUENCE public.menu_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_items_id_seq OWNER TO zackpdl;

--
-- Name: menu_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zackpdl
--

ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;


--
-- Name: menus; Type: TABLE; Schema: public; Owner: zackpdl
--

CREATE TABLE public.menus (
    id integer NOT NULL,
    restaurant_id integer NOT NULL,
    name character varying(255),
    description text,
    image text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    price numeric(10,2)
);


ALTER TABLE public.menus OWNER TO zackpdl;

--
-- Name: menus_id_seq; Type: SEQUENCE; Schema: public; Owner: zackpdl
--

CREATE SEQUENCE public.menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menus_id_seq OWNER TO zackpdl;

--
-- Name: menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zackpdl
--

ALTER SEQUENCE public.menus_id_seq OWNED BY public.menus.id;


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
    rating integer NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    customer_name character varying(255),
    restaurant_id integer,
    user_id integer,
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
-- Name: menu id; Type: DEFAULT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.menu ALTER COLUMN id SET DEFAULT nextval('public.menu_id_seq'::regclass);


--
-- Name: menu_items id; Type: DEFAULT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.menu_items ALTER COLUMN id SET DEFAULT nextval('public.menu_items_id_seq'::regclass);


--
-- Name: menus id; Type: DEFAULT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.menus ALTER COLUMN id SET DEFAULT nextval('public.menus_id_seq'::regclass);


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
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: zackpdl
--

COPY public.menu (id, host_id, dish_name, description, price) FROM stdin;
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: zackpdl
--

COPY public.menu_items (id, menu_id, name, price, image, description, restaurant_id) FROM stdin;
1	\N	Tom Yum Goong	14.99	/uploads/tom-yum.jpg	Spicy and sour Thai soup with prawns, mushrooms, and aromatic herbs	4
2	\N	Green Curry Chicken	16.99	/uploads/green-curry.jpg	Authentic Thai green curry with tender chicken and vegetables	4
3	\N	Pad Thai	15.99	/uploads/pad-thai.jpg	Classic stir-fried rice noodles with shrimp, tofu, and peanuts	4
4	\N	Mango Sticky Rice	8.99	/uploads/mango-rice.jpg	Sweet sticky rice with fresh mango and coconut cream	4
5	\N	Som Tum	12.99	/uploads/som-tum.jpg	Spicy green papaya salad with peanuts and lime dressing	4
6	\N	Massaman Curry	17.99	/uploads/massaman.jpg	Rich and mild curry with potatoes, onions, and your choice of meat	4
\.


--
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: zackpdl
--

COPY public.menus (id, restaurant_id, name, description, image, created_at, updated_at, price) FROM stdin;
6	4	Chicken Biryani	A flavorful rice dish with chicken, spices, and herbs.	\N	2025-02-19 13:01:43.150929+07	2025-02-19 13:01:43.150929+07	9.99
7	4	Falafel Wrap	Crispy falafel balls wrapped in pita with fresh veggies and tahini.	\N	2025-02-19 13:01:43.150929+07	2025-02-19 13:01:43.150929+07	5.99
8	4	Shawarma Plate	Tender slices of marinated meat with rice and a side salad.	\N	2025-02-19 13:01:43.150929+07	2025-02-19 13:01:43.150929+07	12.49
11	4	dog	dog	\N	2025-02-19 17:44:15.01743+07	2025-02-19 17:44:15.01743+07	10.00
9	4	Hummus with Pita	Creamy hummus served with warm pita bread.	\N	2025-02-19 13:01:43.150929+07	2025-02-19 17:46:04.778487+07	50.00
10	4	Lamb Kebabs	Grilled lamb skewers with spices, served with a side of rice.	\N	2025-02-19 13:01:43.150929+07	2025-02-19 17:46:15.252985+07	200.00
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

COPY public.reviews (id, rating, comment, created_at, updated_at, customer_name, restaurant_id, user_id) FROM stdin;
39b0e0a7-6b43-424d-af70-c74a5ac385d0	5	Amazing food and great service!	2025-02-18 11:10:40.089867+07	2025-02-18 11:10:40.089867+07	Alice	4	1
06e1a02a-1c80-4654-8195-be7aa4608210	4	Good taste, but a bit expensive.	2025-02-18 11:10:40.089867+07	2025-02-18 11:10:40.089867+07	Bob	4	2
503b1a0d-7c60-4cb2-b261-4d7b4da6d828	3	Average experience, nothing special.	2025-02-18 11:10:40.089867+07	2025-02-18 11:10:40.089867+07	Charlie	4	3
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
-- Name: menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zackpdl
--

SELECT pg_catalog.setval('public.menu_id_seq', 1, false);


--
-- Name: menu_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zackpdl
--

SELECT pg_catalog.setval('public.menu_items_id_seq', 6, true);


--
-- Name: menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zackpdl
--

SELECT pg_catalog.setval('public.menus_id_seq', 11, true);


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
-- Name: menu menu_pkey; Type: CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);


--
-- Name: menus menus_pkey; Type: CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_pkey PRIMARY KEY (id);


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
-- Name: menu_items fk_restaurant; Type: FK CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT fk_restaurant FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id);


--
-- Name: menu menu_host_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_host_id_fkey FOREIGN KEY (host_id) REFERENCES public.hosts(id);


--
-- Name: menu_items menu_items_menu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.menus(id) ON DELETE CASCADE;


--
-- Name: menus menus_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE;


--
-- Name: restaurants restaurants_host_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zackpdl
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_host_id_fkey FOREIGN KEY (host_id) REFERENCES public.hosts(id) ON DELETE CASCADE;


--
-- Name: admins; Type: ROW SECURITY; Schema: public; Owner: zackpdl
--

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

--
-- Name: favorites; Type: ROW SECURITY; Schema: public; Owner: zackpdl
--

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

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

