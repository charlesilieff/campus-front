pipeline {
    agent any
    stages {
        stage('Install') {
            steps {

                echo "Npm install..."
                sh "npm install"
            }
        }
        stage('Package') {
            steps {
                echo "Compiling with parcel..."
                sh "npx parcel build src/main.html"
            }
        }
    }
}