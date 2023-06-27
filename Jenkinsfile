pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'docker-compose build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'docker-compose run --rm node1 npm test'
                sh 'docker-compose run --rm node2 npm test'
                sh 'docker-compose run --rm node3 npm test'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
    
    post {
        always {
            sh 'docker-compose down'
        }
    }
}
