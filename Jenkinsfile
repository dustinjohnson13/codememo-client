#!groovy

import groovy.json.JsonOutput

stage('Test') {
    node {

        checkout scm

        def build = "${env.JOB_NAME} - #${env.BUILD_NUMBER}".toString()

        def email = [to: "${env.EMAIL}", from: "${env.EMAIL}"]
        def notify = [email: email]

        currentBuild.result = "SUCCESS"

        try {
            sh './gradlew clean build'
        } catch (err) {
            currentBuild.result = "FAILURE"

            email.putAll([subject: "$build failed!", body: "${env.JOB_NAME} failed! See ${env.BUILD_URL} for details."])

            def cmd = env.NOTIFY_COMMAND + " -d '${JsonOutput.toJson(notify)}'"
            sh cmd

            throw err
        } finally {
            junit "gradle-build/test-results/**/*.xml"

            publishHTML target: [
                    allowMissing         : false,
                    alwaysLinkToLastBuild: false,
                    keepAll              : true,
                    reportDir            : 'gradle-build/coverage/lcov-report',
                    reportFiles          : 'index.html',
                    reportName           : "Coverage Report"
            ]
        }
    }
}