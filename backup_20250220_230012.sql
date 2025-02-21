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
    phone character varying(15)
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

COPY public.hosts (id, email, password, phone) FROM stdin;
6	admin@example.com	$2b$10$sgC3VUgLGqFDOgpaa/PFxu5pFcQ97ic5zsjYVv1GZG40t9fjGezHe	099876
7	tom@example.com	$2b$10$gglqmcVDnCYPIwd7N8nYK.RAN/O.KYZt55VdtjYmhXP/9XCgECZFW	098512
8	alice@example.com	$2b$10$gglqmcVDnCYPIwd7N8nYK.RAN/O.KYZt55VdtjYmhXP/9XCgECZFW	0912345678
9	bob@example.com	$2b$10$gglqmcVDnCYPIwd7N8nYK.RAN/O.KYZt55VdtjYmhXP/9XCgECZFW	0923456789
10	charlie@example.com	$2b$10$gglqmcVDnCYPIwd7N8nYK.RAN/O.KYZt55VdtjYmhXP/9XCgECZFW	0934567890
11	david@example.com	$2b$10$gglqmcVDnCYPIwd7N8nYK.RAN/O.KYZt55VdtjYmhXP/9XCgECZFW	0945678901
12	eva@example.com	$2b$10$gglqmcVDnCYPIwd7N8nYK.RAN/O.KYZt55VdtjYmhXP/9XCgECZFW	0956789012
14	yum@example.com	$2b$10$Sm31TSVQ1Z1GtBTDT73do.cRIjU4lxo7HGAc2Olh21BgiLtDTXiIS	494949
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
7	4	Falafel Wrap	Crispy falafel balls wrapped in pita with fresh veggies and tahini.	\N	2025-02-19 13:01:43.150929+07	2025-02-19 13:01:43.150929+07	5.99
8	4	Shawarma Plate	Tender slices of marinated meat with rice and a side salad.	\N	2025-02-19 13:01:43.150929+07	2025-02-19 13:01:43.150929+07	12.49
11	4	dog	dog	\N	2025-02-19 17:44:15.01743+07	2025-02-19 17:44:15.01743+07	10.00
9	4	Hummus with Pita	Creamy hummus served with warm pita bread.	\N	2025-02-19 13:01:43.150929+07	2025-02-19 17:46:04.778487+07	50.00
10	4	Lamb Kebabs	Grilled lamb skewers with spices, served with a side of rice.	\N	2025-02-19 13:01:43.150929+07	2025-02-19 17:46:15.252985+07	200.00
6	4	Chicken Biryani	A flavorful rice dish with chicken boobs, spices, and herbs.	\N	2025-02-19 13:01:43.150929+07	2025-02-20 15:35:03.695604+07	9.99
\.


--
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: zackpdl
--

COPY public.restaurants (id, restaurant_name, address, city, cuisine, opening_hours, closing_hours, halal_cert_type, halal_cert_number, halal_cert_expiry, host_id) FROM stdin;
3	Tom	1 st	bkk		05:00:00	22:00:00	MUIS	CERT-2986	2026-05-30	6
4	Tom Yum Goong	Tom Yum Goong, 4/17 Moo 2 Lam Kaen, Thai Mueang District, Phang Nga 82210	Khaolak		10:00:00	22:00:00	MUIS	CERT-4714	2026-11-23	7
5	Alice’s Kitchen	123 Main St	Bangkok	Thai	08:00:00	20:00:00	MUIS	CERT-1000	2026-07-28	8
6	Bob’s BBQ	45 BBQ Lane	Chiang Mai	BBQ	11:00:00	23:00:00	HMC	CERT-3669	2026-01-03	9
7	Charlie’s Coffee	789 Bean St	Phuket	Cafe	07:00:00	19:00:00	HMC	CERT-4153	2025-06-25	10
8	David’s Donuts	321 Sweet St	Pattaya	Dessert	06:00:00	18:00:00	JAKIM	CERT-1216	2025-06-05	11
11	yum	jsdj	jsdjj	Thai	11:11:00	04:44:00	JAKIM	123456	1111-11-11	14
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: zackpdl
--

COPY public.reviews (id, rating, comment, created_at, updated_at, customer_name, restaurant_id, user_id) FROM stdin;
39b0e0a7-6b43-424d-af70-c74a5ac385d0	5	Amazing food and great service!	2025-02-18 11:10:40.089867+07	2025-02-18 11:10:40.089867+07	Alice	4	1
06e1a02a-1c80-4654-8195-be7aa4608210	4	Good taste, but a bit expensive.	2025-02-18 11:10:40.089867+07	2025-02-18 11:10:40.089867+07	Bob	4	2
503b1a0d-7c60-4cb2-b261-4d7b4da6d828	3	Average experience, nothing special.	2025-02-18 11:10:40.089867+07	2025-02-18 11:10:40.089867+07	Charlie	4	3
8da8f423-7e7c-4aeb-bbda-5b10cdfb574e	4	Great Thai food, but the place was a bit crowded.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Alex Brown	5	106
fbce5be6-ba6d-4897-821d-d3e0a8c1377d	5	Absolutely loved the Pad Thai here!	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Chris Green	5	107
a4810456-486e-41c2-a77d-71e8a57058eb	3	Good food, but the service could be faster.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Patricia White	5	108
f61b0287-fbb9-47f1-84fe-f8e548340980	4	The Tom Yum soup was excellent, will come back again.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Robert Black	5	109
c51f4bdf-cee0-4dba-95c5-a6cfc9766780	5	Everything was perfect, from the ambiance to the food!	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Linda Grey	5	110
86f11603-2a18-41ee-99a8-804279efcd79	4	The BBQ ribs were amazing, but the sides were just okay.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Mark Taylor	6	111
13ed5949-bbcd-4340-96d6-339ec06ae22a	5	Best BBQ experience ever! The meat was so tender.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Karen Hill	6	112
28703f95-d84a-4596-bb72-6000e55d5045	3	Good food, but the prices are a bit high.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	James Wilson	6	113
5eb629f6-7378-42d0-8b62-3c7fbadaa720	4	Loved the smoked brisket, but the wait was long.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Susan Moore	6	114
2da698e3-f69b-43a5-990c-222a749ec466	5	The atmosphere was great, and the food was even better.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	David Clark	6	115
956aec1d-a44d-4e28-a85d-ef4468461e99	5	This is my go-to coffee spot, always consistent.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Laura Adams	7	116
8865fe49-f03e-4177-af54-150b0c01f59f	4	Great coffee, but the seating area is small.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Michael Scott	7	117
4800ea98-cf51-40e9-a059-b835eed4323e	3	Coffee was good, but the pastries were average.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Elizabeth King	7	118
1075ab0e-04f0-414a-8d75-5555ae511098	5	The latte here is one of the best I’ve ever had.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	William Turner	7	119
0b41111a-29ea-41ad-93dc-357a62be7797	4	Nice cozy place, perfect for working or studying.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Jessica Nelson	7	120
b5765ae3-f257-4242-a577-df62b0f65d5d	4	Donuts were fresh, but the selection was limited.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Thomas Martinez	8	121
83b1e29e-4efd-4fe5-a6c6-e37df5f82927	5	These donuts are heaven on earth!	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Jennifer Lewis	8	122
87fde1ba-1c15-4480-8041-adf99eea50ef	3	Decent donuts, but nothing special compared to others.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Richard Young	8	123
4159651d-f82c-4ee1-949b-5edf3187837e	4	The chocolate donut was divine, but the plain ones were just okay.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Angela Hall	8	124
e97d3ebe-e693-488a-89f5-c5b2439bdab7	5	Perfect for a sweet treat after lunch!	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Matthew Allen	8	125
92ac7a18-a339-4d4a-8b02-2ca6278997f2	4	The variety of dishes was impressive, but some were hit or miss.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Sarah Evans	9	126
6793cb4d-d446-4425-9f4a-78eda67333c4	5	Every dish we tried was fantastic, highly recommend this place.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Daniel Parker	9	127
b390e4e3-07f9-43b8-968b-107515f5a8f7	3	Food was good, but the portions were a bit small.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Rachel Cook	9	128
dc464bac-2de6-4801-a116-d0e1d9943c00	4	The pasta was amazing, but the dessert was just okay.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Andrew Reed	9	129
b2216ab1-41d6-43a5-a114-bc4b9a9e8c7f	5	A truly international experience with flavors from around the world.	2025-02-20 20:46:03.61159+07	2025-02-20 20:46:03.61159+07	Grace Morris	9	130
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: zackpdl
--

COPY public.users (id, email, full_name, created_at, updated_at, password) FROM stdin;
\.


--
-- Name: hosts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zackpdl
--

SELECT pg_catalog.setval('public.hosts_id_seq', 14, true);


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

SELECT pg_catalog.setval('public.restaurants_id_seq', 11, true);


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

