import React,{ useEffect, useState} from 'react';
import {Button, Input, Card, Avatar, Row, Col, Modal, Descriptions, Form} from "antd";
import "../styles/movies.css"

const {Meta} = Card;
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const Movies = (props) =>{
    const [search, setSearh] = useState('');
    const [movies, setMovies] = useState( []);
    const [showModal, setShowModal ] = useState(false);
    const [currentMovieId, setCurrentMovieId] = useState( null );
    const [movieDetails, setMovieDetails] = useState( null );

    useEffect( () => {

        const getMovies = async() => {
            if(search !== ''){
                const response = await fetch(`http://www.omdbapi.com/?apikey=96bcab50&s=${search}`);
                const data = await response.json();
                console.log('MOVIES', data);
                setMovies(data.Search);
            }
        };
        getMovies();

    }, [search]);

    useEffect( () => {
        const getMoviesDetails = async() => {
            if(currentMovieId) {
                const response = await fetch(`http://www.omdbapi.com/?apikey=96bcab50&i=${currentMovieId}`);
                const data = await response.json();
                console.log('MOVIE DETAILS', data);
                setMovieDetails(data);
                setShowModal(true);
            }
        };
        getMoviesDetails();

    }, [currentMovieId]);

    const handleViewDetails = (id) => {
        setCurrentMovieId(id);
    }

    const handleSearchMovie = (values)=>{
        setSearh(values.searchText)
    };

    return (
        <>
            <Form className="inicioForm" name="basic" initialValues={{ searchText: '' }} onFinish={handleSearchMovie}>
                <h1>PelisBuho</h1>
                <Form.Item
                    label=""
                    name="searchText"
                    rules={[{
                        required: true,
                        message: 'Porfavor ingrese palabra clave a buscar' }]}
                >
                    <Input style={{width: 300}} placeholder="Ingrese nombre de una pelicula"/>
                </Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Buscar
                    </Button>
                </Form.Item>
            </Form>

            <Row>
                {
                    movies.map((movie, index)=>{
                        return (
                            <Col>
                                <Card
                                    style={{ width: 300, marginRight: 20, marginBottom: 30 }}
                                    cover={
                                        <img
                                            alt="example"
                                            src={movie.Poster}
                                        />
                                    }
                                    actions={[
                                        <Button  key="setting" onClick={ () => handleViewDetails(movie.imdbID)}>Dellates</Button>                                        
                                    ]}
                                >
                                    <Meta
                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title={movie.Title}
                                        description={`${movie.Type} - ${movie.Year}`}
                                    />
                                </Card>
                            </Col>
                        )
                    })
                }
            </Row>

            {
                movieDetails &&
                <Modal title={movieDetails.Title} visible={showModal} onCancel={null}
                footer={[
                    <Button key="close" onClick={() => setShowModal(false)} > Cerrar</Button>
                ]}
                 width={900}
                >
                    <Descriptions bordered >
                        <Descriptions.Item label="Año">
                             {movieDetails.Year}
                        </Descriptions.Item>
                        <Descriptions.Item label="Calificación">
                            {movieDetails.Rated}
                        </Descriptions.Item>
                        <Descriptions.Item label="Año de lanzamiento">
                            {movieDetails.Released}
                        </Descriptions.Item>
                        <Descriptions.Item label="Duración">
                            {movieDetails.Runtime}
                        </Descriptions.Item>
                        <Descriptions.Item label="Género">
                            {movieDetails.Genre}
                        </Descriptions.Item>
                    </Descriptions>
                </Modal>
            }
        </>
    );

}

export default Movies;


      